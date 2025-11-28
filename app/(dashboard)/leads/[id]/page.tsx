"use client"

import { Label } from "@/components/ui/label"

import { useState, use } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Car,
  DollarSign,
  MapPin,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { CallLoggingModal } from "@/components/call-logging-modal"
import { TaskCreationDialog } from "@/components/task-creation-dialog"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { useLead } from "@/hooks/use-supabase-data"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { LeadStatusUpdateDialog } from "@/components/lead-status-update-dialog"

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { lead, loading, error } = useLead(id)
  const [showCallModal, setShowCallModal] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Lead" subtitle="Cargando..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Lead" subtitle="Error al cargar lead" />
        <div className="flex-1 px-8 pt-10 pb-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Lead no encontrado'}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Transform lead data for display
  const leadData = {
    id: lead.id,
    name: lead.name || "Sin nombre",
    phone: lead.phone || "Sin teléfono",
    email: lead.metadata?.email || lead.source || "", // Try metadata first
    source: lead.source || "unknown",
    status: lead.status || "nuevo",
    urgency_level: lead.urgency_level || "media",
    vehicleInterest: lead.vehicle_interest || "No especificado",
    budget: lead.budget_range || "No especificado",
    assignedTo: lead.assigned_user?.full_name || lead.assigned_user?.email || "Sin asignar",
    createdAt: lead.created_at,
    lastContact: lead.last_contact_at,
    notes: lead.notes || "",
  }

  // Transform interactions, tasks, and appointments into timeline activities
  const activities: any[] = []
  
  // Add interactions
  if (lead.interactions && Array.isArray(lead.interactions)) {
    lead.interactions.forEach((interaction: any) => {
      const interactionType = interaction.type || "call"
      const outcome = interaction.outcome || ""
      const duration = interaction.duration_seconds
        ? `${Math.floor(interaction.duration_seconds / 60)} min ${interaction.duration_seconds % 60} seg`
        : null
      const userName = interaction.user?.full_name || interaction.user?.email || "Usuario desconocido"
      const createdAt = interaction.created_at
        ? formatDistanceToNow(new Date(interaction.created_at), { addSuffix: true, locale: es })
        : ""

      let description = ""
      if (interactionType.includes("call")) {
        const outcomeText = {
          answered: "Contestó - Hablé con el lead",
          voicemail: "Dejé mensaje de voz",
          "no-answer": "No contestó",
          "wrong-number": "Número incorrecto",
        }[outcome] || outcome

        description = `Llamada: ${outcomeText}`
        if (duration) {
          description += ` (${duration})`
        }
        if (interaction.content) {
          description += `\n${interaction.content}`
        }
      } else {
        description = interaction.content || `${interactionType}`
      }

      activities.push({
        id: interaction.id,
        type: "call",
        description,
        createdBy: userName,
        createdAt,
        timestamp: interaction.created_at,
        interaction: interaction,
      })
    })
  }

  // Add tasks
  if (lead.tasks && Array.isArray(lead.tasks)) {
    lead.tasks.forEach((task: any) => {
      const userName = task.assigned_user?.full_name || task.assigned_user?.email || "Sin asignar"
      const createdAt = task.created_at
        ? formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: es })
        : ""
      const dueAt = task.due_at
        ? formatDistanceToNow(new Date(task.due_at), { addSuffix: true, locale: es })
        : null

      let description = `Tarea: ${task.title || "Sin título"}`
      if (task.description) {
        description += `\n${task.description}`
      }
      if (dueAt) {
        description += `\nVence: ${dueAt}`
      }
      if (task.status === "completada") {
        description += `\n✅ Completada`
      }

      activities.push({
        id: task.id,
        type: "task",
        description,
        createdBy: userName,
        createdAt,
        timestamp: task.created_at,
        task: task,
      })
    })
  }

  // Add appointments
  if (lead.appointments && Array.isArray(lead.appointments)) {
    lead.appointments.forEach((appointment: any) => {
      const createdAt = appointment.scheduled_at
        ? formatDistanceToNow(new Date(appointment.scheduled_at), { addSuffix: true, locale: es })
        : ""
      const scheduledAt = appointment.scheduled_at
        ? format(new Date(appointment.scheduled_at), "dd/MM/yyyy 'a las' HH:mm", { locale: es })
        : ""

      let description = `Cita: ${appointment.appointment_type || "Cita"}`
      if (scheduledAt) {
        description += `\nProgramada para: ${scheduledAt}`
      }
      if (appointment.status) {
        description += `\nEstado: ${appointment.status}`
      }
      if (appointment.notes) {
        description += `\n${appointment.notes}`
      }

      activities.push({
        id: appointment.id,
        type: "appointment",
        description,
        createdBy: "Sistema",
        createdAt,
        timestamp: appointment.scheduled_at || appointment.created_at,
        appointment: appointment,
      })
    })
  }

  // Sort activities by timestamp (newest first)
  activities.sort((a, b) => {
    if (!a.timestamp) return 1
    if (!b.timestamp) return -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const handleCall = () => {
    // Make a call
    window.open(`tel:${leadData.phone}`)
    // Show call logging modal after a short delay
    setTimeout(() => setShowCallModal(true), 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Detalles del Lead" subtitle={leadData.name} />

      <div className="flex-1 px-8 pt-10 pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="mb-4">
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="gap-2 rounded-2xl">
                <ArrowLeft className="h-4 w-4" />
                Volver a Leads
              </Button>
            </Link>
          </div>

          {/* Header Card */}
          <GlassCard>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                    {leadData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {leadData.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="default">{leadData.status}</Badge>
                      {leadData.urgency_level && (
                        <Badge variant={leadData.urgency_level === 'alta' || leadData.urgency_level === 'urgente' ? 'destructive' : 'secondary'}>
                          {leadData.urgency_level}
                        </Badge>
                      )}
                      <Badge variant="outline">{leadData.source}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {leadData.phone}
                      </div>
                      {leadData.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {leadData.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={handleCall} className="gap-2 h-11 rounded-2xl">
                    <Phone className="h-4 w-4" />
                    Llamar Ahora
                  </Button>
                  <Button variant="outline" className="gap-2 h-11 bg-transparent rounded-2xl">
                    <MessageSquare className="h-4 w-4" />
                    Enviar SMS
                  </Button>
                  <Button variant="outline" className="gap-2 h-11 bg-transparent rounded-2xl">
                    <Mail className="h-4 w-4" />
                    Enviar Correo
                  </Button>
                  <Link href="/appointments/book">
                    <Button variant="outline" className="gap-2 w-full h-11 bg-transparent rounded-2xl">
                      <Calendar className="h-4 w-4" />
                      Agendar Cita
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Info Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Interés en Vehículo</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{leadData.vehicleInterest}</p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-muted-foreground">Rango de Presupuesto</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{leadData.budget}</p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">Último Contacto</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {leadData.lastContact 
                    ? formatDistanceToNow(new Date(leadData.lastContact), { addSuffix: true, locale: es })
                    : 'Nunca'}
                </p>
              </CardContent>
            </GlassCard>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
              <TabsTrigger value="notes">Notas</TabsTrigger>
              <TabsTrigger value="qualification">Calificación</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Línea de Tiempo</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activities.length} {activities.length === 1 ? "actividad" : "actividades"}
                  </p>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay actividades registradas</p>
                      <p className="text-xs mt-1">Las llamadas, tareas y citas aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {activity.type === "call" && <Phone className="h-5 w-5 text-primary" />}
                            {activity.type === "task" && <Clock className="h-5 w-5 text-primary" />}
                            {activity.type === "appointment" && <Calendar className="h-5 w-5 text-primary" />}
                            {activity.type === "note" && <MessageSquare className="h-5 w-5 text-primary" />}
                            {activity.type === "status_change" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground mb-1 whitespace-pre-wrap break-words">
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.createdBy} • {activity.createdAt}
                            </p>
                            {activity.interaction?.outcome && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {activity.interaction.outcome}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex gap-3">
                      <Textarea placeholder="Agregar una nota o actualización..." rows={2} />
                      <Button>Agregar Nota</Button>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="notes">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea placeholder="Agregar notas sobre este lead..." rows={6} />
                    <Button>Guardar Notas</Button>
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="qualification">
              <LeadQualificationForm leadId={lead.id} />
            </TabsContent>

            <TabsContent value="info">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Información del Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Asignado a</Label>
                      <p className="text-sm font-medium text-foreground mt-1">{leadData.assignedTo}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fecha de Creación</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {leadData.createdAt 
                          ? formatDistanceToNow(new Date(leadData.createdAt), { addSuffix: true, locale: es })
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fuente</Label>
                      <p className="text-sm font-medium text-foreground mt-1 capitalize">{leadData.source}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Estado</Label>
                      <p className="text-sm font-medium text-foreground mt-1 capitalize">{leadData.status}</p>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start gap-2 bg-transparent">
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar como Calificado
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2 bg-transparent"
                  onClick={() => setShowTaskDialog(true)}
                >
                  <Calendar className="h-4 w-4" />
                  Crear Tarea
                </Button>
                <Button variant="outline" className="justify-start gap-2 bg-transparent">
                  <Car className="h-4 w-4" />
                  Compartir Vehículo
                </Button>
                <Button 
                    variant="outline" 
                    className="justify-start gap-2 text-success bg-transparent"
                    onClick={() => setShowStatusDialog(true)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar Venta Cerrada
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>

      <CallLoggingModal
        open={showCallModal}
        onOpenChange={setShowCallModal}
        leadName={leadData.name}
        leadId={leadData.id}
      />

      <TaskCreationDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        leadId={leadData.id}
        leadName={leadData.name}
        onSuccess={() => {
          // Optionally refresh lead data or show success message
        }}
      />

      <LeadStatusUpdateDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        leadId={leadData.id}
        newStatus="closed"
        onSuccess={() => {
            window.location.reload()
        }}
      />
    </div>
  )
}
