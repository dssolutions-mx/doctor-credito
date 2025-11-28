"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageSquare, User, DollarSign, Car, Clock, Plus, Gauge, ExternalLink } from "lucide-react"
import type { Lead } from "@/lib/types"
import { LeadStatusBadge } from "./lead-status-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { LeadStatusUpdateDialog } from "./lead-status-update-dialog"
import { toast } from "sonner"

interface LeadDetailSheetProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailSheet({ lead, open, onOpenChange }: LeadDetailSheetProps) {
  const [note, setNote] = useState("")
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<'closed' | 'lost' | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'closed' || newStatus === 'lost') {
      setPendingStatus(newStatus)
      setShowStatusDialog(true)
    } else {
      // Direct update for other statuses
      try {
        const response = await fetch(`/api/leads/${lead?.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
        
        if (!response.ok) throw new Error("Failed to update status")
        
        toast.success("Estado actualizado")
        // Note: Real-time update in UI requires a context or prop callback to refetch
        // For now we assume the user might need to refresh or the parent will handle it if it was polling
      } catch (e) {
        toast.error("Error al actualizar estado")
      }
    }
  }

  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showHandle bodyClassName="flex flex-col gap-6 overflow-y-auto px-6 pb-8 pt-20">
        <SheetTitle className="sr-only">
          Detalles del Lead: {lead.firstName} {lead.lastName}
        </SheetTitle>
        <div className="glass-section p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-[28px] leading-[36px] font-semibold text-foreground tracking-tight">
                {lead.firstName} {lead.lastName}
              </h2>
              <p className="text-[13px] leading-[18px] text-muted-foreground mt-1.5">
                ID del Lead: {lead.id} • Creado el {format(lead.createdAt, "PP", { locale: es })}
              </p>
            </div>
            <LeadStatusBadge status={lead.status} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              size="lg"
              variant="ghost"
              className="glass-chip h-12 justify-center gap-2.5 text-[15px] font-semibold text-foreground hover:text-foreground"
            >
              <Phone className="h-5 w-5" />
              Llamar
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="glass-chip h-12 justify-center gap-2.5 text-[15px] font-semibold text-foreground hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
              Correo
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="glass-chip h-12 justify-center gap-2.5 text-[15px] font-semibold text-foreground hover:text-foreground"
            >
              <MessageSquare className="h-5 w-5" />
              SMS
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="flex flex-col gap-4">
          <TabsList className="glass-control w-full">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="glass-section mt-2 p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[17px] leading-[24px] font-semibold text-foreground">Información de Contacto</h3>
                <div className="space-y-4 text-[15px] leading-[20px]">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-[80px] shrink-0">Email:</span>
                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline truncate">
                      {lead.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-[80px] shrink-0">Teléfono:</span>
                    <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[17px] leading-[24px] font-semibold text-foreground">Detalles del Lead</h3>
                <div className="grid gap-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <Label className="text-[13px] leading-[18px] font-semibold text-muted-foreground">Fuente</Label>
                      <p className="text-[15px] leading-[20px] font-medium mt-1.5 capitalize">{lead.source}</p>
                    </div>
                    <div>
                      <Label className="text-[13px] leading-[18px] font-semibold text-muted-foreground">Prioridad</Label>
                      <p className="text-[15px] leading-[20px] font-medium mt-1.5 capitalize">{lead.priority}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[13px] leading-[18px] font-semibold text-muted-foreground">Interés en Vehículo</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <p className="text-[15px] leading-[20px] font-medium">{lead.vehicleInterest}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[13px] leading-[18px] font-semibold text-muted-foreground">Rango de Presupuesto</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <p className="text-[15px] leading-[20px] font-medium">{lead.budget}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Vehicle */}
              {(lead as any).vehicle && (
                <div className="space-y-4">
                  <h3 className="text-[17px] leading-[24px] font-semibold text-foreground">Vehículo de Interés</h3>
                  <div className="glass-section p-4 space-y-3">
                    <div className="flex gap-4">
                      {/* Vehicle Image */}
                      {(lead as any).vehicle.primary_image_url && (
                        <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={(lead as any).vehicle.primary_image_url}
                            alt={`${(lead as any).vehicle.year} ${(lead as any).vehicle.make} ${(lead as any).vehicle.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Vehicle Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <p className="text-[15px] leading-[20px] font-semibold">
                            {(lead as any).vehicle.year} {(lead as any).vehicle.make} {(lead as any).vehicle.model}
                          </p>
                          {(lead as any).vehicle.trim && (
                            <p className="text-[13px] leading-[18px] text-muted-foreground">{(lead as any).vehicle.trim}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[13px] leading-[18px]">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold text-primary">
                              ${((lead as any).vehicle.sale_price || (lead as any).vehicle.price).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {(lead as any).vehicle.mileage.toLocaleString()} mi
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Stock: {(lead as any).vehicle.stock_number}
                          </Badge>
                          {(lead as any).vehicle.status === 'available' ? (
                            <Badge variant="default" className="text-xs">Disponible</Badge>
                          ) : (lead as any).vehicle.status === 'sold' ? (
                            <Badge variant="outline" className="text-xs">Vendido</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Pendiente</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link href={`/dealer/inventory/${(lead as any).vehicle.id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ver Detalles del Vehículo
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid gap-5">

                  <div>
                    <Label className="text-[13px] leading-[18px] font-semibold text-muted-foreground">Asignado a</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <p className="text-[15px] leading-[20px] font-medium">{lead.assignedTo}</p>
                    </div>
                  </div>

                  {lead.nextFollowUp && (
                    <div>
                      <Label className="text-[13px] leading-[18px] font-semibold text-muted-foreground">Próximo Seguimiento</Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <p className="text-[15px] leading-[20px] font-medium">{format(lead.nextFollowUp, "PP p", { locale: es })}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-black/6 dark:border-white/8">
                <Label className="text-[15px] leading-[20px] font-semibold">Actualizar Estado</Label>
                <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-12 rounded-2xl border-black/6 bg-white/60 backdrop-blur shadow-sm dark:border-white/8 dark:bg-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="contacted">Contactado</SelectItem>
                    <SelectItem value="qualified">Calificado</SelectItem>
                    <SelectItem value="appointment">Cita</SelectItem>
                    <SelectItem value="negotiation">Negociación</SelectItem>
                    <SelectItem value="follow-up">Seguimiento</SelectItem>
                    <SelectItem value="closed">Cerrado (Ganado)</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
             {/* ... (Activity content unchanged) ... */}
             <div className="glass-section mt-2 p-6 text-center text-muted-foreground">
                 Actividad no disponible en vista rápida.
             </div>
          </TabsContent>

          <TabsContent value="notes">
             {/* ... (Notes content unchanged) ... */}
             <div className="glass-section mt-2 p-6 space-y-4">
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="rounded-2xl border-black/6 bg-white/60 backdrop-blur shadow-sm text-[15px] leading-[20px] dark:border-white/8 dark:bg-white/10"
                />
                <Button className="glass-chip h-12 w-full justify-center gap-2.5 text-[15px] font-semibold text-foreground">
                  <Plus className="h-5 w-5" />
                  Agregar Nota
                </Button>
             </div>
          </TabsContent>
        </Tabs>

        {pendingStatus && (
            <LeadStatusUpdateDialog
                open={showStatusDialog}
                onOpenChange={setShowStatusDialog}
                leadId={lead.id}
                newStatus={pendingStatus}
                onSuccess={() => {
                    // Refetch or notify parent
                    toast.success("Estado actualizado correctamente")
                }}
            />
        )}
      </SheetContent>
    </Sheet>
  )
}
