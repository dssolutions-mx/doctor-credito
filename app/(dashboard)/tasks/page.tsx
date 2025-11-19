"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, AlertCircle, CheckCircle2, Calendar } from "lucide-react"
import Link from "next/link"
import { useTasks } from "@/hooks/use-supabase-data"
import { formatDistanceToNow, isPast, isToday } from "date-fns"
import { es } from "date-fns/locale"

export default function TasksPage() {
  const { tasks: allTasks, loading } = useTasks('pendiente')

  // Categorize tasks
  const urgentTasks = (allTasks || []).filter(t => {
    if (!t.due_at) return false
    const dueDate = new Date(t.due_at)
    return isPast(dueDate) || t.priority === 'urgente'
  })

  const todayTasks = (allTasks || []).filter(t => {
    if (!t.due_at) return false
    return isToday(new Date(t.due_at)) && t.priority !== 'urgente'
  })

  const upcomingTasks = (allTasks || []).filter(t => {
    if (!t.due_at) return true
    const dueDate = new Date(t.due_at)
    return !isToday(dueDate) && !isPast(dueDate) && t.priority !== 'urgente'
  })

  const priorityColors: Record<string, string> = {
    urgente: "border-destructive",
    alta: "border-warning",
    media: "border-primary",
    baja: "border-muted",
  }

  const renderTask = (task: any, variant: 'urgent' | 'today' | 'upcoming') => {
    const dueText = task.due_at
      ? formatDistanceToNow(new Date(task.due_at), { addSuffix: true, locale: es })
      : 'Sin fecha límite'

    const borderColor = priorityColors[task.priority || 'media'] || 'border-primary'

    return (
      <GlassCard key={task.id} className={`border-l-4 ${borderColor}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold text-foreground">{task.title}</h3>
                {variant === 'urgent' && (
                  <Badge variant="destructive" className="text-xs">
                    {isPast(new Date(task.due_at)) ? 'Vencida' : 'Urgente'}
                  </Badge>
                )}
                {task.auto_generated && (
                  <Badge variant="outline" className="text-xs">
                    Auto
                  </Badge>
                )}
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                {task.lead?.name && (
                  <span>Lead: {task.lead.name}</span>
                )}
                <span>•</span>
                <span className="capitalize">{task.task_type || 'Tarea'}</span>
                <span>•</span>
                <span>{dueText}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gap-2 rounded-2xl">
                  <CheckCircle2 className="h-4 w-4" />
                  Completar
                </Button>
                {task.lead_id && (
                  <Link href={`/leads/${task.lead_id}`}>
                    <Button variant="outline" size="sm" className="rounded-2xl">
                      Ver Lead
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Tareas" subtitle="Administra tus prioridades diarias y seguimientos" />

      <div className="flex-1 px-8 pt-10 pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando tareas...</div>
          ) : (allTasks || []).length === 0 ? (
            <GlassCard>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">¡Todo listo!</h3>
                <p className="text-muted-foreground">
                  No tienes tareas pendientes en este momento.
                </p>
              </CardContent>
            </GlassCard>
          ) : (
            <>
              {/* Urgent Tasks */}
              {urgentTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Urgente ({urgentTasks.length})
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {urgentTasks.map((task) => renderTask(task, 'urgent'))}
                  </div>
                </div>
              )}

              {/* Today's Tasks */}
              {todayTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-warning" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Prioridades de Hoy ({todayTasks.length})
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {todayTasks.map((task) => renderTask(task, 'today'))}
                  </div>
                </div>
              )}

              {/* Upcoming Tasks */}
              {upcomingTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Próximas ({upcomingTasks.length})
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => renderTask(task, 'upcoming'))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
