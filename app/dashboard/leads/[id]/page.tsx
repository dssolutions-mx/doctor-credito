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
import { LeadQualificationForm } from "@/components/lead-qualification-form"

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [showCallModal, setShowCallModal] = useState(false)

  // Mock lead data
  const lead = {
    id: id,
    firstName: "Maria",
    lastName: "Lopez",
    email: "maria.lopez@email.com",
    phone: "(555) 234-5678",
    source: "Facebook",
    status: "contacted",
    priority: "high",
    vehicleInterest: "2019 Honda Civic",
    budget: "$18,000 - $22,000",
    location: "Miami, FL",
    assignedTo: "You",
    createdAt: "2024-01-15",
    lastContact: "2024-01-16",
  }

  const activities = [
    {
      id: "1",
      type: "call",
      description: "Called customer - Interested, good credit, has trade-in",
      createdBy: "Maria Rodriguez",
      createdAt: "2 hours ago",
    },
    {
      id: "2",
      type: "note",
      description: "Customer mentioned they need to finalize by end of month",
      createdBy: "Maria Rodriguez",
      createdAt: "3 hours ago",
    },
    {
      id: "3",
      type: "status_change",
      description: "Status changed from New to Contacted",
      createdBy: "System",
      createdAt: "5 hours ago",
    },
  ]

  const handleCall = () => {
    // Simulate making a call
    window.open(`tel:${lead.phone}`)
    // Show call logging modal after a short delay
    setTimeout(() => setShowCallModal(true), 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Detalles del Lead" subtitle={`${lead.firstName} ${lead.lastName}`} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="mb-4">
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Leads
              </Button>
            </Link>
          </div>

          {/* Header Card */}
          <GlassCard>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                    {lead.firstName[0]}
                    {lead.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {lead.firstName} {lead.lastName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="default">Contactado</Badge>
                      <Badge variant="destructive">Prioridad Alta</Badge>
                      <Badge variant="outline">{lead.source}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {lead.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={handleCall} className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <MessageSquare className="h-4 w-4" />
                    Send SMS
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                  <Link href="/dashboard/appointments/book">
                    <Button variant="outline" className="gap-2 w-full bg-transparent">
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
                  <span className="text-sm font-medium text-muted-foreground">Vehicle Interest</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{lead.vehicleInterest}</p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-muted-foreground">Budget Range</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{lead.budget}</p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">Last Contact</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{lead.lastContact}</p>
              </CardContent>
            </GlassCard>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="qualification">Qualification</TabsTrigger>
              <TabsTrigger value="info">Information</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {activity.type === "call" && <Phone className="h-4 w-4 text-primary" />}
                          {activity.type === "note" && <MessageSquare className="h-4 w-4 text-primary" />}
                          {activity.type === "status_change" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground mb-1">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.createdBy} • {activity.createdAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

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
                      <p className="text-sm font-medium text-foreground mt-1">{lead.assignedTo}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fecha de Creación</Label>
                      <p className="text-sm font-medium text-foreground mt-1">{lead.createdAt}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fuente</Label>
                      <p className="text-sm font-medium text-foreground mt-1">{lead.source}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Estado</Label>
                      <p className="text-sm font-medium text-foreground mt-1">{lead.status}</p>
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
                <Button variant="outline" className="justify-start gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  Programar Seguimiento
                </Button>
                <Button variant="outline" className="justify-start gap-2 bg-transparent">
                  <Car className="h-4 w-4" />
                  Compartir Vehículo
                </Button>
                <Button variant="outline" className="justify-start gap-2 text-success bg-transparent">
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
        leadName={`${lead.firstName} ${lead.lastName}`}
      />
    </div>
  )
}
