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
    <div className="flex flex-col">
      <DashboardHeader title="Dashboard" subtitle="¡Bienvenida de nuevo, Maria! Esto es lo que está pasando hoy." />

      <div className="flex-1 space-y-6 p-6">
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
                <Link href="/dashboard/leads">
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                        <div
                          className={`w-2 h-2 rounded-full ${priorityConfig[lead.priority as keyof typeof priorityConfig].color}`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 truncate">{lead.vehicle}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusConfig[lead.status as keyof typeof statusConfig].variant}
                          className="text-xs"
                        >
                          {statusConfig[lead.status as keyof typeof statusConfig].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{lead.source}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{lead.time}</span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
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
                <Link href="/dashboard/appointments">
                  <Button variant="outline" size="sm">
                    Ver calendario
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                      <div className="text-center">
                        <div className="text-xs font-medium text-primary">{appointment.time.split(" ")[0]}</div>
                        <div className="text-xs text-muted-foreground">{appointment.time.split(" ")[1]}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{appointment.customer}</p>
                        {appointment.status === "confirmed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-warning" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 truncate">{appointment.vehicle}</p>
                      <Badge variant="outline" className="text-xs">
                        {appointment.type}
                      </Badge>
                    </div>
                  </div>
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                <Users className="h-4 w-4" />
                <span>Agregar Nuevo Lead</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                <Calendar className="h-4 w-4" />
                <span>Agendar Cita</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                <Phone className="h-4 w-4" />
                <span>Registrar Llamada</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                <MessageSquare className="h-4 w-4" />
                <span>Enviar Mensaje</span>
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  )
}
