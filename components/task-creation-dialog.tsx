"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/stores/auth-store"

interface TaskCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId?: string
  leadName?: string
  onSuccess?: () => void
}

export function TaskCreationDialog({
  open,
  onOpenChange,
  leadId,
  leadName,
  onSuccess,
}: TaskCreationDialogProps) {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    task_type: "llamar",
    priority: "media",
    due_at: "",
    due_time: "",
    assigned_to: user?.id || "",
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        task_type: "llamar",
        priority: "media",
        due_at: "",
        due_time: "",
        assigned_to: user?.id || "",
      })
    }
  }, [open, user?.id])

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("El título es requerido")
      return
    }

    try {
      setLoading(true)

      // Combine date and time
      let due_at = null
      if (formData.due_at) {
        if (formData.due_time) {
          due_at = new Date(`${formData.due_at}T${formData.due_time}`).toISOString()
        } else {
          due_at = new Date(`${formData.due_at}T23:59:59`).toISOString()
        }
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          task_type: formData.task_type,
          priority: formData.priority,
          due_at: due_at,
          lead_id: leadId || null,
          assigned_to: formData.assigned_to || null,
          status: "pendiente",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear la tarea")
      }

      toast.success("Tarea creada exitosamente")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear la tarea")
    } finally {
      setLoading(false)
    }
  }

  // Get tomorrow's date as default minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            {leadName
              ? `Crea una nueva tarea para ${leadName}`
              : "Completa los detalles de la nueva tarea"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Llamar a cliente"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalles adicionales sobre la tarea..."
              rows={3}
            />
          </div>

          {/* Task Type and Priority */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task_type">Tipo de Tarea</Label>
              <Select
                value={formData.task_type}
                onValueChange={(value) => setFormData({ ...formData, task_type: value })}
              >
                <SelectTrigger id="task_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llamar">Llamar</SelectItem>
                  <SelectItem value="seguimiento">Seguimiento</SelectItem>
                  <SelectItem value="enviar_info">Enviar Información</SelectItem>
                  <SelectItem value="reunion">Reunión</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="due_at">Fecha Límite</Label>
              <Input
                id="due_at"
                type="date"
                value={formData.due_at}
                onChange={(e) => setFormData({ ...formData, due_at: e.target.value })}
                min={minDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_time">Hora (Opcional)</Label>
              <Input
                id="due_time"
                type="time"
                value={formData.due_time}
                onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                disabled={!formData.due_at}
              />
            </div>
          </div>

          {leadId && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Esta tarea estará asociada al lead: <span className="font-medium">{leadName || "Lead"}</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.title.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Tarea"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

