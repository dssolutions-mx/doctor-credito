"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface LeadStatusUpdateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    leadId: string
    newStatus: 'closed' | 'lost'
    currentStatus?: string
    onSuccess?: () => void
}

export function LeadStatusUpdateDialog({ open, onOpenChange, leadId, newStatus, onSuccess }: LeadStatusUpdateDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [dealAmount, setDealAmount] = useState("")
    const [commission, setCommission] = useState("")
    const [lostReason, setLostReason] = useState("")
    const [notes, setNotes] = useState("")

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const payload: any = { status: newStatus }
            
            if (newStatus === 'closed') {
                if (!dealAmount) {
                    toast.error("El monto de la venta es requerido")
                    setIsLoading(false)
                    return
                }
                payload.deal_amount = parseFloat(dealAmount)
                payload.commission_amount = commission ? parseFloat(commission) : 0
                payload.deal_closed_at = new Date().toISOString()
            } else if (newStatus === 'lost') {
                if (!lostReason) {
                    toast.error("La razón es requerida")
                    setIsLoading(false)
                    return
                }
                // Append lost reason to notes as we don't have a specific column for it, or store in metadata
                payload.metadata = { lost_reason: lostReason }
                payload.notes = notes ? `${notes}\n\n[SISTEMA - LEAD PERDIDO]\nRazón: ${lostReason}` : `[SISTEMA - LEAD PERDIDO]\nRazón: ${lostReason}`
            }

            const response = await fetch(`/api/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) throw new Error("Failed to update lead")
            
            toast.success(newStatus === 'closed' ? "Lead marcado como Ganado" : "Lead marcado como Perdido")
            
            // Create status change interaction log
            await fetch(`/api/interactions/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_id: leadId,
                    type: 'status_change',
                    content: `Lead status changed to ${newStatus}`,
                    metadata: { 
                        new_status: newStatus,
                        deal_amount: dealAmount,
                        lost_reason: lostReason
                    }
                })
            })

            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar el lead")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{newStatus === 'closed' ? 'Cerrar Venta' : 'Marcar como Perdido'}</DialogTitle>
                    <DialogDescription>
                        {newStatus === 'closed' 
                            ? 'Ingresa los detalles de la venta para cerrar el lead.' 
                            : 'Por favor indica la razón por la cual se perdió este lead.'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    {newStatus === 'closed' ? (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Monto Venta</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    value={dealAmount} 
                                    onChange={(e) => setDealAmount(e.target.value)}
                                    placeholder="25000"
                                    className="col-span-3" 
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="commission" className="text-right">Comisión</Label>
                                <Input 
                                    id="commission" 
                                    type="number" 
                                    value={commission} 
                                    onChange={(e) => setCommission(e.target.value)}
                                    placeholder="500"
                                    className="col-span-3" 
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">Razón</Label>
                                <Select onValueChange={setLostReason} value={lostReason}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Seleccionar razón" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bought_elsewhere">Compró en otro lado</SelectItem>
                                        <SelectItem value="not_interested">No interesado</SelectItem>
                                        <SelectItem value="bad_credit">Crédito denegado</SelectItem>
                                        <SelectItem value="price_too_high">Precio muy alto</SelectItem>
                                        <SelectItem value="unresponsive">No responde</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Notas</Label>
                                <Textarea 
                                    id="notes" 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Detalles adicionales..."
                                    className="col-span-3" 
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
