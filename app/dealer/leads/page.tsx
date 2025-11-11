"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, MessageSquare, Mail, Eye } from "lucide-react"
import { mockLeads } from "@/lib/mock-data"
import { LeadStatusBadge } from "@/components/lead-status-badge"
import { LeadDetailSheet } from "@/components/lead-detail-sheet"
import type { Lead } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { cn } from "@/lib/utils"

const priorityColors = {
  urgent: "bg-destructive",
  high: "bg-warning",
  medium: "bg-accent",
  low: "bg-muted",
}

export default function DealerLeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all")

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsSheetOpen(true)
  }

  const filteredLeads = mockLeads.filter((lead) => {
    if (filterStatus !== "all" && lead.status !== filterStatus) return false
    if (filterSource !== "all" && lead.source !== filterSource) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Leads Activos" subtitle={`${filteredLeads.length} leads para tu concesionario`} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Filters */}
        <GlassCard>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Buscar por nombre, teléfono o email..." className="h-10" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="contacted">Contactado</SelectItem>
                  <SelectItem value="qualified">Calificado</SelectItem>
                  <SelectItem value="appointment">Cita</SelectItem>
                  <SelectItem value="closed">Cerrado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Fuentes</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="website">Sitio Web</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                  <SelectItem value="referral">Referido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </GlassCard>

        {/* Leads List */}
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <GlassCard key={lead.id} className="cursor-pointer hover:shadow-elevation-2 transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => handleLeadClick(lead)}>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <LeadStatusBadge status={lead.status} />
                      {lead.priority && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            priorityColors[lead.priority as keyof typeof priorityColors] || priorityColors.medium,
                          )}
                        >
                          {lead.priority === "urgent" ? "Urgente" : lead.priority === "high" ? "Alta" : lead.priority === "medium" ? "Media" : "Baja"}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                      </div>
                      <div>
                        {lead.vehicleInterest && (
                          <span className="text-xs">
                            Interés: {lead.vehicleInterest} • {lead.source} • {format(new Date(lead.createdAt), "PP", { locale: es })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dealer/leads/${lead.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <GlassCard>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No se encontraron leads que coincidan con tus filtros</p>
            </CardContent>
          </GlassCard>
        )}
      </div>

      {/* Lead Detail Sheet */}
      <LeadDetailSheet lead={selectedLead} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  )
}

