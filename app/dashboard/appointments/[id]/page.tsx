"use client"

import { use } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Calendar, Clock, Car, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  // Mock appointment data
  const appointment = {
    id: id,
    customerName: "Maria Lopez",
    customerPhone: "(555) 234-5678",
    customerEmail: "maria.lopez@email.com",
    leadId: "1",
    type: "test_drive",
    status: "confirmed",
    date: "Tomorrow, Nov 11, 2025",
    time: "10:00 AM",
    duration: "60 minutes",
    vehicleInterest: "2019 Honda Civic EX",
    location: "Metro Honda, 123 Main St, Miami, FL",
    assignedTo: "Maria Rodriguez",
    notes: "Customer will bring trade-in vehicle for evaluation",
    createdAt: "Nov 8, 2025",
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Detalles de la Cita" subtitle={appointment.customerName} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-4">
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Calendario
              </Button>
            </Link>
          </div>

          {/* Header Card */}
          <GlassCard>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{appointment.customerName}</h2>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="default">Confirmada</Badge>
                      <Badge variant="outline">Prueba de Manejo</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {appointment.date} a las {appointment.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duración: {appointment.duration} minutos
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {appointment.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="gap-2">
                    <Phone className="h-4 w-4" />
                    Llamar Cliente
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Mail className="h-4 w-4" />
                    Enviar Email
                  </Button>
                  <Link href={`/dashboard/appointments/${id}/edit`}>
                    <Button variant="outline" className="gap-2 w-full bg-transparent">
                      <Calendar className="h-4 w-4" />
                      Reprogramar
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Info */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{appointment.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${appointment.customerPhone}`} className="text-primary hover:underline">
                    {appointment.customerPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${appointment.customerEmail}`} className="text-primary hover:underline">
                    {appointment.customerEmail}
                  </a>
                </div>
                <div className="pt-3 border-t border-border">
                  <Link href={`/dashboard/leads/${appointment.leadId}`}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Ver Perfil del Lead
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </GlassCard>

            {/* Vehicle Info */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Detalles del Vehículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{appointment.vehicleInterest}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Ver Detalles del Vehículo
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </div>

          {/* Notes */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {appointment.notes || "No se agregaron notas para esta cita."}
              </p>
            </CardContent>
          </GlassCard>

          {/* Actions */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="bg-transparent text-success">
                  Marcar como Completada
                </Button>
                <Button variant="outline" className="bg-transparent text-warning">
                  Marcar No Presente
                </Button>
                <Link href={`/dashboard/appointments/${id}/edit`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Reprogramar
                  </Button>
                </Link>
                <Button variant="outline" className="bg-transparent text-destructive">
                  Cancelar Cita
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
