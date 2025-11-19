"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Car, TrendingUp, Phone, MessageSquare, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLeads, useAppointments } from "@/hooks/use-supabase-data"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const statusConfig = {
  nuevo: { label: "Nuevo", variant: "default" as const, color: "bg-primary" },
  contactado: { label: "Contactado", variant: "secondary" as const, color: "bg-accent" },
  cita_programada: { label: "Cita", variant: "default" as const, color: "bg-success" },
  negociacion: { label: "Negociación", variant: "outline" as const, color: "bg-warning" },
  cerrado: { label: "Cerrado", variant: "default" as const, color: "bg-success" },
  perdido: { label: "Perdido", variant: "outline" as const, color: "bg-muted" },
}

const urgencyConfig = {
  alta: { color: "bg-destructive", label: "Alta" },
  media: { color: "bg-warning", label: "Media" },
  baja: { color: "bg-muted", label: "Baja" },
}

const appointmentTypeLabels: Record<string, string> = {
  showroom: "Visita Agencia",
  phone: "Llamada",
  video: "Video",
  test_drive: "Prueba de Manejo",
  credit_approval: "Aprobación de Crédito",
  delivery: "Entrega",
}

export default function DashboardPage() {
  const { leads, loading: leadsLoading } = useLeads()
  const { appointments, loading: appointmentsLoading } = useAppointments()

  // Calculate stats from real data
  const activeLeads = leads?.filter(l => !['cerrado', 'perdido'].includes(l.status || '')).length || 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayAppointmentsData = appointments?.filter(a => {
    if (!a.scheduled_at) return false
    const apptDate = new Date(a.scheduled_at)
    apptDate.setHours(0, 0, 0, 0)
    return apptDate.getTime() === today.getTime()
  }) || []

  const closedLeads = leads?.filter(l => l.status === 'cerrado').length || 0
  const totalLeads = leads?.length || 0
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0

  // Recent leads (last 4)
  const recentLeads = leads?.slice(0, 4) || []

  const stats = [
    {
      title: "Leads Activos",
      value: activeLeads.toString(),
      change: `${totalLeads} total`,
      trend: "up",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Citas de Hoy",
      value: todayAppointmentsData.length.toString(),
      change: `${appointments?.length || 0} total`,
      trend: "up",
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Conversiones",
      value: closedLeads.toString(),
      change: "este mes",
      trend: "neutral",
      icon: Car,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Tasa de Conversión",
      value: `${conversionRate}%`,
      change: `${totalLeads} leads`,
      trend: "up",
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Dashboard" subtitle="¡Bienvenida de nuevo, Maria! Esto es lo que está pasando hoy." />

      <div className="flex-1 space-y-8 px-8 pt-10 pb-8 overflow-y-auto">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <GlassCard key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.trend === "up" ? "text-success" : "text-foreground"}>{stat.change}</span>
                  {" desde la semana pasada"}
                </p>
              </CardContent>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Leads */}
          <GlassCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leads Recientes</CardTitle>
                  <CardDescription>Tus nuevas oportunidades</CardDescription>
                </div>
                        <Link href="/leads">
                          <Button variant="outline" size="sm">
                            Ver todos
                          </Button>
                        </Link>
              </div>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : recentLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay leads recientes</div>
              ) : (
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <Link key={lead.id} href={`/leads/${lead.id}`}>
                      <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[15px] leading-[20px] font-semibold text-foreground truncate">
                              {lead.name || lead.phone || 'Sin nombre'}
                            </p>
                            {lead.urgency_level && urgencyConfig[lead.urgency_level as keyof typeof urgencyConfig] && (
                              <div className={`w-2 h-2 rounded-full ${urgencyConfig[lead.urgency_level as keyof typeof urgencyConfig].color}`} />
                            )}
                          </div>
                          <p className="text-[13px] leading-[18px] text-muted-foreground mb-2 truncate">
                            {lead.vehicle_interest || 'Sin vehículo específico'}
                          </p>
                          <div className="flex items-center gap-2">
                            {lead.status && statusConfig[lead.status as keyof typeof statusConfig] && (
                              <Badge
                                variant={statusConfig[lead.status as keyof typeof statusConfig].variant}
                                className="text-[13px] rounded-full"
                              >
                                {statusConfig[lead.status as keyof typeof statusConfig].label}
                              </Badge>
                            )}
                            <span className="text-[13px] leading-[18px] text-muted-foreground capitalize">
                              {lead.source || 'Facebook'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[13px] leading-[18px] text-muted-foreground whitespace-nowrap">
                            {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: es }) : 'Reciente'}
                          </span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </GlassCard>

          {/* Today's Appointments */}
          <GlassCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Citas de Hoy</CardTitle>
                  <CardDescription>{todayAppointmentsData.length} programadas para hoy</CardDescription>
                </div>
                <Link href="/appointments">
                  <Button variant="outline" size="sm">
                    Ver calendario
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : todayAppointmentsData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay citas programadas para hoy</div>
              ) : (
                <div className="space-y-3">
                  {todayAppointmentsData.slice(0, 3).map((appointment) => {
                    const apptDate = appointment.scheduled_at ? new Date(appointment.scheduled_at) : null
                    const timeStr = apptDate ? apptDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '--:--'
                    const [time, period] = timeStr.split(' ')

                    return (
                      <Link key={appointment.id} href={`/appointments/${appointment.id}`}>
                        <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/8 border border-primary/12">
                            <div className="text-center">
                              <div className="text-[15px] leading-[20px] font-semibold text-primary">{time}</div>
                              <div className="text-[13px] leading-[18px] text-muted-foreground">{period || ''}</div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[15px] leading-[20px] font-semibold text-foreground truncate">
                                {appointment.lead?.name || 'Cliente'}
                              </p>
                              {appointment.status === "confirmada" ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <Clock className="h-4 w-4 text-warning" />
                              )}
                            </div>
                            <p className="text-[13px] leading-[18px] text-muted-foreground mb-2 truncate">
                              {appointment.vehicle_interest || appointment.lead?.vehicle_interest || 'Vehículo no especificado'}
                            </p>
                            <Badge variant="outline" className="text-[13px] rounded-full">
                              {appointmentTypeLabels[appointment.appointment_type || ''] || appointment.appointment_type || 'Consulta'}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes para acelerar tu flujo de trabajo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Link href="/leads/new">
                        <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent rounded-2xl text-[15px] leading-[20px] font-medium">
                          <Users className="h-5 w-5" />
                          <span>Agregar Nuevo Lead</span>
                        </Button>
                      </Link>
                      <Link href="/appointments/book">
                        <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent rounded-2xl text-[15px] leading-[20px] font-medium">
                          <Calendar className="h-5 w-5" />
                          <span>Agendar Cita</span>
                        </Button>
                      </Link>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent rounded-2xl text-[15px] leading-[20px] font-medium">
                <Phone className="h-5 w-5" />
                <span>Registrar Llamada</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent rounded-2xl text-[15px] leading-[20px] font-medium">
                <MessageSquare className="h-5 w-5" />
                <span>Enviar Mensaje</span>
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  )
}
