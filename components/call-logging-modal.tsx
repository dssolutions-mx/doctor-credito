"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CallLoggingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadName?: string
  onComplete?: () => void
}

export function CallLoggingModal({ open, onOpenChange, leadName, onComplete }: CallLoggingModalProps) {
  const [outcome, setOutcome] = useState<string>("")
  const [nextAction, setNextAction] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const handleSubmit = () => {
    console.log("[v0] Call logged:", { outcome, nextAction, notes })

    // Redirect based on next action
    if (nextAction === "appointment") {
      window.location.href = "/dashboard/appointments/book"
    }

    onComplete?.()
    onOpenChange(false)
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
          )}

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!outcome}>
            {nextAction === "appointment" ? "Guardar y Agendar Cita" : "Guardar Registro de Llamada"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
