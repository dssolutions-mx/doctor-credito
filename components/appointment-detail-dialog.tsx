"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Calendar, Clock, Car, User, CheckCircle2, X, AlertCircle, Loader2 } from "lucide-react"
import type { Appointment } from "@/lib/types"
import { format } from "date-fns"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LeadStatusUpdateDialog } from "./lead-status-update-dialog"

interface AppointmentDetailDialogProps {
  appointment: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

const typeLabels: Record<string, string> = {
  test_drive: "Prueba de Manejo",
  credit_approval: "Aprobación de Crédito",
  delivery: "Entrega de Vehículo",
  trade_in: "Evaluación de Cambio",
  consultation: "Consulta",
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning", icon: any }> = {
  programada: { label: "Programada", variant: "outline", icon: Clock },
  confirmada: { label: "Confirmada", variant: "default", icon: CheckCircle2 },
  completada: { label: "Completada", variant: "secondary", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", variant: "destructive", icon: X },
  no_show: { label: "No Asistió", variant: "destructive", icon: AlertCircle },
  pending: { label: "Pendiente", variant: "outline", icon: Clock },
}

export function AppointmentDetailDialog({ appointment, open, onOpenChange, onUpdate }: AppointmentDetailDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false)
  const [outcome, setOutcome] = useState("")
  
  // Lead Status Dialog
  const [leadStatusDialogOpen, setLeadStatusDialogOpen] = useState(false)
  const [leadStatusType, setLeadStatusType] = useState<'closed' | 'lost'>('closed')

  if (!appointment) return null

  const StatusIcon = statusConfig[appointment.status]?.icon || Clock
  const statusVariant = statusConfig[appointment.status]?.variant || "outline"
  const statusLabel = statusConfig[appointment.status]?.label || appointment.status

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    try {
        const response = await fetch(`/api/appointments`, { // Need specific endpoint or use PATCH on collection with ID? 
            // The API route I saw earlier was GET/POST on /api/appointments.
            // I should check if there is /api/appointments/[id] or if POST handles update.
            // Usually standard is PATCH /api/appointments/[id].
            // If not exist, I'll try to use execute_sql or assume I need to create the route.
            // I'll assume PATCH /api/appointments/[id] exists or I will create it. 
            // Wait, I didn't check for [id] route for appointments.
            // I will use /api/appointments with method PATCH if supported, or creates separate route.
            // Let's assume standard REST.
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: appointment.id, status: newStatus })
        }) 
        
        // Wait, I should check if `app/api/appointments/[id]/route.ts` exists.
        // It does NOT exist in the file list I saw earlier.
        // `app/api/appointments/route.ts` exists.
        // I should probably add PATCH to `app/api/appointments/route.ts` or create `[id]`.
        // I'll create `app/api/appointments/[id]/route.ts` afterwards if needed.
        // For now let's write the fetch to `/api/appointments/${appointment.id}` and I will ensure backend exists.
    } catch (error) {
        // ...
    }
  }
  
  // Actually, I'll update the component logic first.

  const updateStatus = async (status: string, notes?: string) => {
      setIsLoading(true)
      try {
          const response = await fetch(`/api/appointments/${appointment.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status, notes })
          })
          
          if (!response.ok) throw new Error("Failed")
          
          toast.success("Cita actualizada")
          onUpdate?.()
          onOpenChange(false)
      } catch (error) {
          toast.error("Error al actualizar la cita")
      } finally {
          setIsLoading(false)
      }
  }

  const handleOutcomeSubmit = () => {
      if (!outcome) return

      if (outcome === 'sold') {
          setLeadStatusType('closed')
          setLeadStatusDialogOpen(true)
          setOutcomeDialogOpen(false)
          // Update appointment to completed in background or after lead update?
          updateStatus('completada', 'Venta cerrada durante la cita')
      } else if (outcome === 'lost') {
          setLeadStatusType('lost')
          setLeadStatusDialogOpen(true)
          setOutcomeDialogOpen(false)
          updateStatus('completada', 'Cliente no interesado')
      } else if (outcome === 'follow_up') {
          updateStatus('completada', 'Seguimiento requerido')
          // Ideally trigger task creation here
      } else if (outcome === 'no_show') {
          updateStatus('no_show')
      }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{typeLabels[appointment.type] || appointment.type}</DialogTitle>
              <DialogDescription className="mt-1">ID: {appointment.id}</DialogDescription>
            </div>
            <Badge variant={statusVariant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {statusLabel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Fecha</span>
              </div>
              <p className="text-base font-medium">{format(new Date(appointment.date), "EEEE, d 'de' MMMM, yyyy")}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Hora</span>
              </div>
              <p className="text-base font-medium">
                {format(new Date(appointment.date), "h:mm a")} ({appointment.duration} min)
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold text-foreground">Información del Cliente</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Nombre:</span>
                <span className="text-sm font-medium">{appointment.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Teléfono:</span>
                <a
                  href={`tel:${appointment.customerPhone}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {appointment.customerPhone || 'N/A'}
                </a>
              </div>
              {appointment.customerEmail && (
                <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground w-24">Email:</span>
                    <a
                    href={`mailto:${appointment.customerEmail}`}
                    className="text-sm font-medium text-primary hover:underline truncate"
                    >
                    {appointment.customerEmail}
                    </a>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold text-foreground">Detalles</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Vehículo:</span>
                <span className="text-sm font-medium">{appointment.vehicleInterest}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Asignado a:</span>
                <span className="text-sm font-medium">{appointment.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-semibold text-foreground">Notas</h4>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t flex-wrap">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.open(`tel:${appointment.customerPhone}`)}>
              <Phone className="h-4 w-4 mr-2" />
              Llamar
            </Button>
            
            {appointment.status === 'programada' && (
                <>
                    <Button 
                        variant="outline" 
                        className="flex-1 bg-transparent border-primary text-primary hover:bg-primary/10"
                        onClick={() => updateStatus('confirmada')}
                        disabled={isLoading}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmar
                    </Button>
                    <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => updateStatus('cancelada')}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>
                </>
            )}

            {(appointment.status === 'confirmada' || appointment.status === 'programada') && (
                <Button 
                    className="flex-[2]"
                    onClick={() => setOutcomeDialogOpen(true)}
                    disabled={isLoading}
                >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completar Cita
                </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Outcome Dialog */}
    <Dialog open={outcomeDialogOpen} onOpenChange={setOutcomeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Resultado de la Cita</DialogTitle>
                <DialogDescription>¿Cuál fue el resultado de la cita?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Button onClick={() => { setOutcome('sold'); handleOutcomeSubmit(); }} className="w-full justify-start" variant="outline">
                    🤑 Venta Cerrada (Ganado)
                </Button>
                <Button onClick={() => { setOutcome('follow_up'); handleOutcomeSubmit(); }} className="w-full justify-start" variant="outline">
                    📅 Seguimiento (Interesado)
                </Button>
                <Button onClick={() => { setOutcome('lost'); handleOutcomeSubmit(); }} className="w-full justify-start" variant="outline">
                    👎 No Interesado (Perdido)
                </Button>
                <Button onClick={() => { setOutcome('no_show'); handleOutcomeSubmit(); }} className="w-full justify-start" variant="destructive">
                    🚫 No Asistió (No Show)
                </Button>
            </div>
        </DialogContent>
    </Dialog>

    {/* Lead Status Update Dialog */}
    {appointment?.leadId && (
        <LeadStatusUpdateDialog 
            open={leadStatusDialogOpen}
            onOpenChange={setLeadStatusDialogOpen}
            leadId={appointment.leadId}
            newStatus={leadStatusType}
            onSuccess={() => {
                onUpdate?.()
            }}
        />
    )}
    </>
  )
}
