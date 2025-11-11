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
import { mockLeads } from "@/lib/mock-data"
import { LeadStatusBadge } from "@/components/lead-status-badge"
import { LeadDetailSheet } from "@/components/lead-detail-sheet"
import { CallLoggingModal } from "@/components/call-logging-modal"
import type { Lead } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

const priorityColors = {
  urgent: "bg-destructive",
  high: "bg-warning",
  medium: "bg-accent",
  low: "bg-muted",
}

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all")

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsSheetOpen(true)
  }

  const handleCall = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation()
    setSelectedLead(lead)
    setIsCallModalOpen(true)
  }

  const filteredLeads = mockLeads.filter((lead) => {
    if (filterStatus !== "all" && lead.status !== filterStatus) return false
    if (filterSource !== "all" && lead.source !== filterSource) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Leads" subtitle={`${filteredLeads.length} leads activos`} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Filters and Actions */}
        <GlassCard>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Buscar por nombre, email o teléfono..." className="h-10" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="contacted">Contactado</SelectItem>
                  <SelectItem value="qualified">Calificado</SelectItem>
                  <SelectItem value="appointment">Cita</SelectItem>
                  <SelectItem value="follow-up">Seguimiento</SelectItem>
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
                </SelectContent>
              </Select>
              <Button asChild>
                <Link href="/dashboard/leads/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Lead
                </Link>
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Leads List */}
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <GlassCard
              key={lead.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleLeadClick(lead)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Priority Indicator */}
                  <div
                    className={`w-1 h-16 rounded-full ${priorityColors[lead.priority]} md:block hidden flex-shrink-0`}
                  />

                  {/* Lead Info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <LeadStatusBadge status={lead.status} />
                        <span className="text-xs text-muted-foreground capitalize truncate">{lead.source}</span>
                        <span className="hidden md:inline text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground capitalize truncate">
                          Prioridad {lead.priority}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm min-w-0">
                      <span className="font-medium text-foreground truncate">{lead.vehicleInterest}</span>
                      <span className="text-muted-foreground flex-shrink-0">•</span>
                      <span className="text-muted-foreground truncate">{lead.budget}</span>
                    </div>

                    {lead.nextFollowUp && (
                      <div className="text-xs text-muted-foreground truncate">
                        Próximo seguimiento: {format(lead.nextFollowUp, "d 'de' MMM, yyyy h:mm a", { locale: es })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={(e) => handleCall(e, lead)}>
                      <Phone className="h-4 w-4 md:mr-0 mr-2" />
                      <span className="md:hidden">Llamar</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Mail className="h-4 w-4 md:mr-0 mr-2" />
                      <span className="md:hidden">Email</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <MessageSquare className="h-4 w-4 md:mr-0 mr-2" />
                      <span className="md:hidden">SMS</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Lead Detail Sheet */}
      <LeadDetailSheet lead={selectedLead} open={isSheetOpen} onOpenChange={setIsSheetOpen} />

      <CallLoggingModal
        open={isCallModalOpen}
        onOpenChange={setIsCallModalOpen}
        leadName={selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : undefined}
      />
    </div>
  )
}
