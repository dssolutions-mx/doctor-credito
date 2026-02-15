"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Phone, MessageSquare, Mail } from "lucide-react"
import { useLeads } from "@/hooks/use-supabase-data"
import { LeadStatusBadge } from "@/components/lead-status-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

const urgencyColors = {
  urgente: "bg-destructive",
  alta: "bg-warning",
  media: "bg-accent",
  baja: "bg-muted",
}

export default function LeadsPage() {
  const { leads, loading } = useLeads()
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [filterCreditType, setFilterCreditType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleCall = (e: React.MouseEvent, lead: any) => {
    e.stopPropagation()
    setSelectedLead(lead)
    setIsCallModalOpen(true)
  }

  const creditTypeLabels: Record<string, string> = {
    malo: "Malo",
    regular: "Regular",
    bueno: "Bueno",
    first_time_buyer: "FTB",
  }

  const filteredLeads = (leads || []).filter((lead) => {
    if (filterStatus !== "all" && lead.status !== filterStatus) return false
    if (filterSource !== "all" && lead.source !== filterSource) return false
    if (filterCreditType !== "all" && (lead as any).credit_type !== filterCreditType) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        lead.name?.toLowerCase().includes(search) ||
        lead.phone?.toLowerCase().includes(search) ||
        lead.vehicle_interest?.toLowerCase().includes(search)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Leads" subtitle={`${filteredLeads.length} leads activos`} />

      <div className="flex-1 px-8 pt-10 pb-8 space-y-8 overflow-y-auto">
        {/* Filters and Actions */}
        <GlassCard>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o teléfono..."
                  className="h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="contactado">Contactado</SelectItem>
                  <SelectItem value="calificado">Calificado</SelectItem>
                  <SelectItem value="cita_programada">Cita</SelectItem>
                  <SelectItem value="negociacion">Negociación</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="website">Sitio Web</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                  <SelectItem value="referral">Referido</SelectItem>
                  <SelectItem value="walkin">Visita Directa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCreditType} onValueChange={setFilterCreditType}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Crédito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="first_time_buyer">First Time Buyer</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild>
                <Link href="/conversations">
                  <Plus className="h-4 w-4 mr-2" />
                  Ver Conversaciones
                </Link>
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Leads List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Cargando leads...</div>
        ) : filteredLeads.length === 0 ? (
          <GlassCard>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No hay leads que coincidan con los filtros</p>
              <Button asChild variant="outline">
                <Link href="/conversations">Ver Conversaciones de N8N</Link>
              </Button>
            </CardContent>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <Link key={lead.id} href={`/leads/${lead.id}`}>
                <GlassCard className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Priority Indicator */}
                      {lead.urgency_level && urgencyColors[lead.urgency_level as keyof typeof urgencyColors] && (
                        <div
                          className={`w-1 h-16 rounded-full ${urgencyColors[lead.urgency_level as keyof typeof urgencyColors]} md:block hidden flex-shrink-0`}
                        />
                      )}

                      {/* Lead Info */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {lead.name || lead.phone || 'Sin nombre'}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <LeadStatusBadge status={lead.status || 'nuevo'} />
                            {(lead as any).credit_type && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-muted">
                                {creditTypeLabels[(lead as any).credit_type] || (lead as any).credit_type}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground capitalize truncate">{lead.source || 'facebook'}</span>
                            {lead.urgency_level && (
                              <>
                                <span className="hidden md:inline text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground capitalize truncate">
                                  Urgencia {lead.urgency_level}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{lead.phone || 'Sin teléfono'}</span>
                          </div>
                          {lead.vehicle_interest && (
                            <div className="flex items-center gap-2 text-foreground font-medium min-w-0">
                              <span className="truncate">{lead.vehicle_interest}</span>
                            </div>
                          )}
                        </div>

                        {(lead.budget_range || (lead as any).down_payment_amount) && (
                          <div className="flex items-center gap-2 text-sm min-w-0">
                            <span className="text-muted-foreground truncate">
                              Presupuesto: {lead.budget_range || "—"}
                              {(lead as any).down_payment_amount && ` • Enganche: $${Number((lead as any).down_payment_amount).toLocaleString()}`}
                            </span>
                          </div>
                        )}
                        {((lead as any).city || (lead as any).state) && (
                          <div className="text-xs text-muted-foreground truncate">
                            {(lead as any).city}{(lead as any).city && (lead as any).state ? ", " : ""}{(lead as any).state}
                          </div>
                        )}

                        {lead.next_follow_up_at && (
                          <div className="text-xs text-muted-foreground truncate">
                            Próximo seguimiento: {format(new Date(lead.next_follow_up_at), "d 'de' MMM, yyyy h:mm a", { locale: es })}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={(e) => handleCall(e, lead)}
                        >
                          <Phone className="h-4 w-4 md:mr-0 mr-2" />
                          <span className="md:hidden">Llamar</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <MessageSquare className="h-4 w-4 md:mr-0 mr-2" />
                          <span className="md:hidden">WhatsApp</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
