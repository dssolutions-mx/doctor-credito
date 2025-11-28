"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CalendarIcon, List, Clock, CheckCircle2 } from "lucide-react"
import { useAppointments } from "@/hooks/use-supabase-data"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { AppointmentDetailDialog } from "@/components/appointment-detail-dialog"
import { CreateAppointmentDialog } from "@/components/create-appointment-dialog"
import type { Appointment } from "@/lib/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const typeLabels = {
  test_drive: "Prueba de Manejo",
  credit_approval: "Aprobación de Crédito",
  delivery: "Entrega de Vehículo",
  trade_in: "Evaluación de Cambio",
  consultation: "Consulta",
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  programada: { label: "Programada", variant: "outline" },
  confirmada: { label: "Confirmada", variant: "default" },
  completada: { label: "Completada", variant: "secondary" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  no_show: { label: "No Asistió", variant: "destructive" },
  // Legacy status values for compatibility
  pending: { label: "Pendiente", variant: "outline" },
  confirmed: { label: "Confirmado", variant: "default" },
  completed: { label: "Completado", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
}

export default function AppointmentsPage() {
  const { appointments: rawAppointments, loading, error } = useAppointments()
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Transform database appointments to component format
  const appointments = (rawAppointments || []).map((apt: any) => ({
    id: apt.id,
    date: apt.scheduled_at,
    time: format(new Date(apt.scheduled_at), "h:mm a"),
    duration: apt.duration_minutes || 60,
    customerName: apt.lead?.name || "Cliente sin nombre",
    customerEmail: apt.lead?.phone || "",
    vehicleInterest: apt.vehicle_interest || "No especificado",
    type: apt.appointment_type || "showroom",
    status: apt.status || "programada",
    assignedTo: apt.lead?.assigned_user?.full_name || apt.lead?.assigned_user?.email || "Sin asignar",
    notes: apt.notes || "",
    // Pass full objects for detail view
    customerPhone: apt.lead?.phone,
    leadId: apt.lead_id
  }))

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const stats = {
    total: appointments.length,
    today: appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      aptDate.setHours(0, 0, 0, 0)
      return aptDate.getTime() === today.getTime()
    }).length,
    confirmed: appointments.filter((apt) => apt.status === "confirmada" || apt.status === "confirmed").length,
    pending: appointments.filter((apt) => apt.status === "programada" || apt.status === "pending").length,
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Citas" subtitle="Cargando citas..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Citas" subtitle="Error al cargar citas" />
        <div className="flex-1 px-8 pt-10 pb-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Citas" subtitle={`${stats.total} citas programadas`} />

      <div className="flex-1 px-8 pt-10 pb-8 space-y-8 overflow-y-auto">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.today}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.confirmed}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </GlassCard>
        </div>

        {/* Main Content */}
        <GlassCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Calendario</CardTitle>
                <CardDescription>Administra tus citas y calendario</CardDescription>
              </div>
              <Button 
                className="rounded-2xl h-11"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Vista de Calendario
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  Vista de Lista
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-4">
                {appointments.length > 0 ? (
                  <AppointmentCalendar appointments={appointments} onAppointmentClick={handleAppointmentClick} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No hay citas programadas</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="list" className="space-y-3">
                {appointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <List className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No hay citas programadas</p>
                  </div>
                ) : (
                  appointments
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10">
                          <div className="text-center">
                            <div className="text-xs font-medium text-primary uppercase">
                              {format(new Date(appointment.date), "MMM")}
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {format(new Date(appointment.date), "d")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(appointment.date), "EEE")}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-foreground truncate">
                              {appointment.customerName}
                            </h3>
                            <Badge variant={statusConfig[appointment.status]?.variant || "outline"}>
                              {statusConfig[appointment.status]?.label || appointment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 truncate">
                            {typeLabels[appointment.type] || appointment.type} • {appointment.vehicleInterest}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(new Date(appointment.date), "h:mm a")} • {appointment.duration} min
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{appointment.assignedTo}</span>
                          {(appointment.status === "confirmada" || appointment.status === "confirmed") && (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          )}
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </GlassCard>
      </div>

      {/* Appointment Detail Dialog */}
      <AppointmentDetailDialog 
        appointment={selectedAppointment} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onUpdate={() => window.location.reload()}
      />

      {/* Create Appointment Dialog */}
      <CreateAppointmentDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => window.location.reload()}
      />
    </div>
  )
}
