"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MessageSquare, User, DollarSign, Car, Clock, Plus } from "lucide-react"
import type { Lead } from "@/lib/types"
import { LeadStatusBadge } from "./lead-status-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface LeadDetailSheetProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailSheet({ lead, open, onOpenChange }: LeadDetailSheetProps) {
  const [note, setNote] = useState("")

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
                <Select defaultValue={lead.status}>
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
                    <SelectItem value="closed">Cerrado</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="glass-section mt-2 p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="glass-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/8 border border-primary/12 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-[15px] leading-[20px] font-semibold text-foreground">Llamada Telefónica</p>
                  <p className="text-[13px] leading-[18px] text-muted-foreground">
                    Llamada de contacto inicial. Cliente interesado en opciones de financiamiento.
                  </p>
                  <p className="text-[13px] leading-[18px] text-muted-foreground">
                    {lead.lastContact && format(lead.lastContact, "PP p", { locale: es })} • Maria Rodriguez
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="glass-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/8 border border-accent/12 text-accent">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-[15px] leading-[20px] font-semibold text-foreground">Lead Creado</p>
                  <p className="text-[13px] leading-[18px] text-muted-foreground">Nuevo lead de {lead.source}</p>
                  <p className="text-[13px] leading-[18px] text-muted-foreground">
                    {format(lead.createdAt, "PP p", { locale: es })} • Sistema
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="glass-section mt-2 p-6 space-y-5">
              <div className="rounded-2xl bg-white/60 border border-black/6 p-5 backdrop-blur shadow-sm dark:border-white/8 dark:bg-white/10">
                <p className="text-[15px] leading-[24px] text-foreground">{lead.notes}</p>
                <p className="text-[13px] leading-[18px] text-muted-foreground mt-3">
                  {format(lead.createdAt, "PP", { locale: es })} • Maria Rodriguez
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-[15px] leading-[20px] font-semibold">Agregar Nota</Label>
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
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
