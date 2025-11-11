"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CalendarIcon, List, Clock, CheckCircle2 } from "lucide-react"
import { mockAppointments } from "@/lib/mock-data"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { AppointmentDetailDialog } from "@/components/appointment-detail-dialog"
import type { Appointment } from "@/lib/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const typeLabels = {
  test_drive: "Prueba de Manejo",
  credit_approval: "Aprobación de Crédito",
  delivery: "Entrega de Vehículo",
  trade_in: "Evaluación de Cambio",
  consultation: "Consulta",
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "outline" as const },
  confirmed: { label: "Confirmado", variant: "default" as const },
  completed: { label: "Completado", variant: "secondary" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
  no_show: { label: "No Asistió", variant: "destructive" as const },
}

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  const stats = {
    total: mockAppointments.length,
    today: mockAppointments.filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.date)
      return aptDate.toDateString() === today.toDateString()
    }).length,
    confirmed: mockAppointments.filter((apt) => apt.status === "confirmed").length,
    pending: mockAppointments.filter((apt) => apt.status === "pending").length,
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
              <Button className="rounded-2xl h-11">
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
                <AppointmentCalendar appointments={mockAppointments} onAppointmentClick={handleAppointmentClick} />
              </TabsContent>

              <TabsContent value="list" className="space-y-3">
                {mockAppointments
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
                          <Badge variant={statusConfig[appointment.status].variant}>
                            {statusConfig[appointment.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1 truncate">
                          {typeLabels[appointment.type]} • {appointment.vehicleInterest}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(appointment.date), "h:mm a")} • {appointment.duration} min
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">{appointment.assignedTo}</span>
                        {appointment.status === "confirmed" && <CheckCircle2 className="h-5 w-5 text-success" />}
                      </div>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </GlassCard>
      </div>

      {/* Appointment Detail Dialog */}
      <AppointmentDetailDialog appointment={selectedAppointment} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
