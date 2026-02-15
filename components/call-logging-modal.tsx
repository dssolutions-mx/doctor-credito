"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/stores/auth-store"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CallLoggingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId?: string
  leadName?: string
  onComplete?: () => void
}

export function CallLoggingModal({ open, onOpenChange, leadId, leadName, onComplete }: CallLoggingModalProps) {
  const router = useRouter()
  const { profile, user } = useAuthStore()
  const [outcome, setOutcome] = useState<string>("")
  const [nextAction, setNextAction] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [durationMinutes, setDurationMinutes] = useState<string>("")
  const [durationSeconds, setDurationSeconds] = useState<string>("")
  const [loading, setLoading] = useState(false)
  
  // Follow-up scheduling state
  const [followUpOption, setFollowUpOption] = useState<"tomorrow" | "2days" | "3days" | "custom">("tomorrow")
  const [followUpDate, setFollowUpDate] = useState<string>("")
  const [followUpTime, setFollowUpTime] = useState<string>("10:00")

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setOutcome("")
      setNextAction("")
      setNotes("")
      setDurationMinutes("")
      setDurationSeconds("")
      setFollowUpOption("tomorrow")
      setFollowUpDate("")
      setFollowUpTime("10:00")
    }
  }, [open])

  // Calculate follow-up date based on option
  const calculateFollowUpDate = (): Date => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    
    switch (followUpOption) {
      case "tomorrow":
        return tomorrow
      case "2days":
        const in2Days = new Date(now)
        in2Days.setDate(in2Days.getDate() + 2)
        in2Days.setHours(10, 0, 0, 0)
        return in2Days
      case "3days":
        const in3Days = new Date(now)
        in3Days.setDate(in3Days.getDate() + 3)
        in3Days.setHours(10, 0, 0, 0)
        return in3Days
      case "custom":
        if (followUpDate) {
          const customDate = new Date(`${followUpDate}T${followUpTime || "10:00"}`)
          // Validate that date is in the future
          if (customDate <= now) {
            toast.error("La fecha de seguimiento debe ser en el futuro")
            return tomorrow // Fallback to tomorrow
          }
          return customDate
        }
        return tomorrow // Fallback to tomorrow
      default:
        return tomorrow
    }
  }

  // Get tomorrow's date as default minimum for date picker
  const getTomorrowDate = (): string => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const mapOutcomeToType = (outcome: string): string => {
    const mapping: Record<string, string> = {
      "answered": "call_outbound",
      "voicemail": "call_outbound_voicemail",
      "no-answer": "call_outbound_no_answer",
      "wrong-number": "call_outbound_wrong_number",
    }
    return mapping[outcome] || "call_outbound"
  }

  const calculateDurationSeconds = (): number | null => {
    const mins = parseInt(durationMinutes) || 0
    const secs = parseInt(durationSeconds) || 0
    if (mins === 0 && secs === 0) return null
    return mins * 60 + secs
  }

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "No registrada"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins} min ${secs > 0 ? `${secs} seg` : ""}`.trim()
    }
    return `${secs} seg`
  }

  const formatOutcome = (outcome: string): string => {
    const mapping: Record<string, string> = {
      "answered": "Contestó - Hablé con el lead",
      "voicemail": "Dejé mensaje de voz",
      "no-answer": "No contestó",
      "wrong-number": "Número incorrecto",
    }
    return mapping[outcome] || outcome
  }

  const getUserName = (): string => {
    return profile?.full_name || user?.email || "Usuario"
  }

  const createTaskDescription = (actionType: string, interactionData: any): string => {
    const callDate = format(new Date(), "dd/MM/yyyy 'a las' HH:mm", { locale: es })
    const duration = formatDuration(interactionData.duration_seconds)
    const outcome = formatOutcome(interactionData.outcome)
    const userName = getUserName()
    const followUpDate = format(calculateFollowUpDate(), "dd/MM/yyyy 'a las' HH:mm", { locale: es })

    let description = `Seguimiento después de llamada con ${leadName || "lead"}\n\n`
    description += `📞 Llamada realizada el ${callDate}\n`
    description += `Resultado: ${outcome}\n`
    description += `Duración: ${duration}\n`
    description += `Realizada por: ${userName}\n\n`

    if (notes) {
      description += `Notas de la llamada:\n${notes}\n\n`
    }

    if (actionType === "follow-up") {
      description += `Próximo seguimiento programado para: ${followUpDate}`
    } else if (actionType === "send-info") {
      description += `Información a enviar:\n${notes || "Información solicitada durante la llamada"}`
    }

    return description
  }

  const handleNextAction = async (interactionData: any) => {
    if (!leadId) return

    try {
      switch (nextAction) {
        case "follow-up": {
          const followUpDate = calculateFollowUpDate()
          const taskDescription = createTaskDescription("follow-up", interactionData)

          // Create follow-up task with enhanced description
          const followUpRes = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lead_id: leadId,
              title: `Seguimiento: ${leadName || "Lead"} - ${formatOutcome(interactionData.outcome)}`,
              description: taskDescription,
              task_type: "seguimiento",
              priority: "alta",
              due_at: followUpDate.toISOString(),
              status: "pendiente",
            }),
          })

          if (!followUpRes.ok) {
            const error = await followUpRes.json()
            throw new Error(error.error || "Error al crear tarea de seguimiento")
          } else {
            toast.success(`Tarea de seguimiento creada para ${format(followUpDate, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}`)
          }
          break
        }

        case "send-info": {
          const sendInfoDate = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
          const taskDescription = createTaskDescription("send-info", interactionData)

          // Create task to send information with enhanced description
          const sendInfoRes = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lead_id: leadId,
              title: `Enviar información: ${leadName || "Lead"}`,
              description: taskDescription,
              task_type: "enviar_info",
              priority: "media",
              due_at: sendInfoDate.toISOString(),
              status: "pendiente",
            }),
          })

          if (!sendInfoRes.ok) {
            const error = await sendInfoRes.json()
            throw new Error(error.error || "Error al crear tarea de envío de información")
          } else {
            toast.success("Tarea de envío de información creada")
          }
          break
        }

        case "qualified": {
          // Update lead status to calificado
          const updateRes = await fetch(`/api/leads/${leadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "calificado",
            }),
          })

          if (!updateRes.ok) {
            console.error("Error updating lead status")
          } else {
            toast.success("Lead marcado como calificado")
          }
          break
        }

        case "not-interested": {
          // Update lead status to no_interesado
          const updateRes = await fetch(`/api/leads/${leadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "no_interesado",
              notes: notes ? `${notes}\n\n[Cliente no está interesado]` : "[Cliente no está interesado]",
            }),
          })

          if (!updateRes.ok) {
            console.error("Error updating lead status")
          } else {
            toast.success("Lead marcado como no interesado")
          }
          break
        }

        case "appointment": {
          // Redirect to appointments page with create dialog open and lead pre-filled
          router.push(`/appointments?new=1&lead_id=${leadId}`)
          break
        }
      }
    } catch (error) {
      console.error("Error handling next action:", error)
    }
  }

  const handleSubmit = async () => {
    if (!leadId) {
      toast.error("ID del lead no disponible")
      return
    }

    if (!outcome) {
      toast.error("Por favor selecciona el resultado de la llamada")
      return
    }

    if (outcome === "answered" && !nextAction) {
      toast.error("Por favor selecciona la próxima acción")
      return
    }

    try {
      setLoading(true)

      const durationSeconds = calculateDurationSeconds()
      const interactionType = mapOutcomeToType(outcome)

      // Save interaction to database
      const response = await fetch("/api/interactions/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          type: interactionType,
          outcome: outcome,
          notes: notes,
          duration_seconds: durationSeconds,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al guardar la interacción")
      }

      const data = await response.json()
      toast.success("Llamada registrada exitosamente")

      // Prepare interaction data for task creation
      const interactionData = {
        outcome: outcome,
        duration_seconds: durationSeconds,
        notes: notes,
      }

      // Handle next action with interaction data
      if (nextAction) {
        await handleNextAction(interactionData)
      }

      onComplete?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error logging call:", error)
      toast.error(error instanceof Error ? error.message : "Error al registrar la llamada")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Llamada</DialogTitle>
          <DialogDescription>
            {leadName ? `Registra tu llamada con ${leadName}` : "Registra los detalles de la llamada y próximos pasos"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Call Outcome */}
          <div className="space-y-3">
            <Label>Resultado de la Llamada *</Label>
            <RadioGroup value={outcome} onValueChange={setOutcome}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="answered" id="answered" />
                <Label htmlFor="answered" className="font-normal cursor-pointer">
                  Contestó - Hablé con el lead
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="voicemail" id="voicemail" />
                <Label htmlFor="voicemail" className="font-normal cursor-pointer">
                  Dejé mensaje de voz
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-answer" id="no-answer" />
                <Label htmlFor="no-answer" className="font-normal cursor-pointer">
                  No contestó
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wrong-number" id="wrong-number" />
                <Label htmlFor="wrong-number" className="font-normal cursor-pointer">
                  Número incorrecto
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Next Action */}
          {outcome === "answered" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nextAction">Próxima Acción *</Label>
                <Select value={nextAction} onValueChange={setNextAction}>
                  <SelectTrigger id="nextAction">
                    <SelectValue placeholder="Seleccionar próxima acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Agendar cita</SelectItem>
                    <SelectItem value="follow-up">Programar seguimiento</SelectItem>
                    <SelectItem value="send-info">Enviar información</SelectItem>
                    <SelectItem value="qualified">Marcar como calificado</SelectItem>
                    <SelectItem value="not-interested">No está interesado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Follow-up Scheduling */}
              {nextAction === "follow-up" && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <Label>Programar Seguimiento</Label>
                  <RadioGroup value={followUpOption} onValueChange={(value) => setFollowUpOption(value as typeof followUpOption)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tomorrow" id="tomorrow" />
                      <Label htmlFor="tomorrow" className="font-normal cursor-pointer">
                        Mañana (10:00 AM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2days" id="2days" />
                      <Label htmlFor="2days" className="font-normal cursor-pointer">
                        En 2 días (10:00 AM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3days" id="3days" />
                      <Label htmlFor="3days" className="font-normal cursor-pointer">
                        En 3 días (10:00 AM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="font-normal cursor-pointer">
                        Fecha personalizada
                      </Label>
                    </div>
                  </RadioGroup>

                  {followUpOption === "custom" && (
                    <div className="grid gap-3 md:grid-cols-2 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="followUpDate">Fecha</Label>
                        <Input
                          id="followUpDate"
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          min={getTomorrowDate()}
                          required={followUpOption === "custom"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followUpTime">Hora</Label>
                        <Input
                          id="followUpTime"
                          type="time"
                          value={followUpTime}
                          onChange={(e) => setFollowUpTime(e.target.value)}
                          required={followUpOption === "custom"}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Call Duration */}
          <div className="space-y-2">
            <Label>Duración de la Llamada</Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Minutos"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Segundos"
                  value={durationSeconds}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                      setDurationSeconds(val)
                    }
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Opcional: Ingresa la duración de la llamada</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Interesado, buen crédito, tiene vehículo para cambio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!outcome || loading || (outcome === "answered" && !nextAction)}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : nextAction === "appointment" ? (
              "Guardar y Agendar Cita"
            ) : (
              "Guardar Registro de Llamada"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
