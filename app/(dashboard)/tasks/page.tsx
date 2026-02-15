"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, AlertCircle, CheckCircle2, Calendar, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { useTasks } from "@/hooks/use-supabase-data"
import { formatDistanceToNow, isPast, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { TaskCreationDialog } from "@/components/task-creation-dialog"

export default function TasksPage() {
  const { tasks: allTasks, loading, refetch } = useTasks('pendiente')
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [taskTemplate, setTaskTemplate] = useState<{
    title: string
    task_type: string
    due_at: string
    due_time?: string
  } | null>(null)

  const openWithTemplate = (template: "llamar_24h" | "seguimiento_3d" | "enviar_info") => {
    const now = new Date()
    if (template === "llamar_24h") {
      const due = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      setTaskTemplate({
        title: "Llamar a lead",
        task_type: "llamar",
        due_at: due.toISOString(),
        due_time: due.toTimeString().slice(0, 5),
      })
    } else if (template === "seguimiento_3d") {
      const due = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      setTaskTemplate({
        title: "Seguimiento",
        task_type: "seguimiento",
        due_at: due.toISOString(),
        due_time: "10:00",
      })
    } else {
      const due = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      setTaskTemplate({
        title: "Enviar información",
        task_type: "enviar_info",
        due_at: due.toISOString(),
        due_time: due.toTimeString().slice(0, 5),
      })
    }
    setShowTaskDialog(true)
  }

  const handleTaskDialogClose = (open: boolean) => {
    setShowTaskDialog(open)
    if (!open) setTaskTemplate(null)
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTaskId(taskId)
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completada",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al completar la tarea")
      }

      toast.success("Tarea completada exitosamente")
      // Refresh tasks list
      if (refetch) {
        refetch()
      } else {
        // Fallback: reload page if refetch not available
        window.location.reload()
      }
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error(error instanceof Error ? error.message : "Error al completar la tarea")
    } finally {
      setCompletingTaskId(null)
    }
  }

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
                <Button
                  size="sm"
                  className="gap-2 rounded-2xl"
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={completingTaskId === task.id}
                >
                  {completingTaskId === task.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Completando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Completar
                    </>
                  )}
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
      <div className="glass-nav sticky top-0 z-40 border-b border-border">
        <div className="flex h-24 items-center justify-between px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] leading-[36px] font-semibold tracking-tight text-foreground">Tareas</h1>
            <p className="text-[15px] leading-[20px] text-muted-foreground mt-1.5">
              Administra tus prioridades diarias y seguimientos
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openWithTemplate("llamar_24h")}
            >
              Llamar en 24h
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openWithTemplate("seguimiento_3d")}
            >
              Seguimiento 3d
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openWithTemplate("enviar_info")}
            >
              Enviar info
            </Button>
            <Button
              onClick={() => {
                setTaskTemplate(null)
                setShowTaskDialog(true)
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </div>
        </div>
      </div>

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

      <TaskCreationDialog
        open={showTaskDialog}
        onOpenChange={handleTaskDialogClose}
        onSuccess={() => {
          if (refetch) refetch()
        }}
        initialValues={taskTemplate || undefined}
      />
    </div>
  )
}
