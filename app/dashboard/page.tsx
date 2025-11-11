import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Car, TrendingUp, Phone, MessageSquare, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data
const stats = [
  {
    title: "Leads Activos",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Citas de Hoy",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Calendar,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Vehículos Disponibles",
    value: "156",
    change: "12 nuevos",
    trend: "neutral",
    icon: Car,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Tasa de Conversión",
    value: "32%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
]

const recentLeads = [
  {
    id: "1",
    name: "Carlos Martinez",
    source: "Facebook",
    vehicle: "2024 Honda Civic",
    status: "new",
    time: "hace 5 min",
    priority: "high",
  },
  {
    id: "2",
    name: "Ana Gutierrez",
    source: "Facebook",
    vehicle: "2023 Toyota Camry",
    status: "contacted",
    time: "hace 23 min",
    priority: "medium",
  },
  {
    id: "3",
    name: "Juan Perez",
    source: "Website",
    vehicle: "2024 Ford F-150",
    status: "appointment",
    time: "hace 1 hora",
    priority: "high",
  },
  {
    id: "4",
    name: "Maria Lopez",
    source: "Facebook",
    vehicle: "2023 Nissan Altima",
    status: "follow-up",
    time: "hace 2 horas",
    priority: "low",
  },
]

const todayAppointments = [
  {
    id: "1",
    customer: "Roberto Silva",
    vehicle: "2024 Honda Accord",
    time: "10:00 AM",
    type: "Prueba de Manejo",
    status: "confirmed",
  },
  {
    id: "2",
    customer: "Patricia Ruiz",
    vehicle: "2023 Toyota RAV4",
    time: "2:00 PM",
    type: "Aprobación de Crédito",
    status: "confirmed",
  },
  {
    id: "3",
    customer: "Luis Fernandez",
    vehicle: "2024 Chevrolet Silverado",
    time: "4:30 PM",
    type: "Entrega",
    status: "pending",
  },
]

const statusConfig = {
  new: { label: "Nuevo", variant: "default" as const, color: "bg-primary" },
  contacted: { label: "Contactado", variant: "secondary" as const, color: "bg-accent" },
  appointment: { label: "Cita", variant: "default" as const, color: "bg-success" },
  "follow-up": { label: "Seguimiento", variant: "outline" as const, color: "bg-warning" },
}

const priorityConfig = {
  high: { color: "bg-destructive", label: "Alta" },
  medium: { color: "bg-warning", label: "Media" },
  low: { color: "bg-muted", label: "Baja" },
}

export default function DashboardPage() {
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
              <div className="space-y-3">
                      {recentLeads.map((lead) => (
                          <Link key={lead.id} href={`/leads/${lead.id}`}>
                  <div
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[15px] leading-[20px] font-semibold text-foreground truncate">{lead.name}</p>
                        <div
                          className={`w-2 h-2 rounded-full ${priorityConfig[lead.priority as keyof typeof priorityConfig].color}`}
                        />
                      </div>
                      <p className="text-[13px] leading-[18px] text-muted-foreground mb-2 truncate">{lead.vehicle}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusConfig[lead.status as keyof typeof statusConfig].variant}
                          className="text-[13px] rounded-full"
                        >
                          {statusConfig[lead.status as keyof typeof statusConfig].label}
                        </Badge>
                        <span className="text-[13px] leading-[18px] text-muted-foreground">{lead.source}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[13px] leading-[18px] text-muted-foreground whitespace-nowrap">{lead.time}</span>
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
            </CardContent>
          </GlassCard>

          {/* Today's Appointments */}
          <GlassCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Citas de Hoy</CardTitle>
                  <CardDescription>8 programadas para hoy</CardDescription>
                </div>
                        <Link href="/appointments">
                          <Button variant="outline" size="sm">
                            Ver calendario
                          </Button>
                        </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                      {todayAppointments.map((appointment) => (
                          <Link key={appointment.id} href={`/appointments/${appointment.id}`}>
                  <div
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/8 border border-primary/12">
                      <div className="text-center">
                        <div className="text-[15px] leading-[20px] font-semibold text-primary">{appointment.time.split(" ")[0]}</div>
                        <div className="text-[13px] leading-[18px] text-muted-foreground">{appointment.time.split(" ")[1]}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[15px] leading-[20px] font-semibold text-foreground truncate">{appointment.customer}</p>
                        {appointment.status === "confirmed" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-warning" />
                        )}
                      </div>
                      <p className="text-[13px] leading-[18px] text-muted-foreground mb-2 truncate">{appointment.vehicle}</p>
                      <Badge variant="outline" className="text-[13px] rounded-full">
                        {appointment.type}
                      </Badge>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
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
