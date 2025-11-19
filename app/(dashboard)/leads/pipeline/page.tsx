"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, GripVertical, Loader2 } from "lucide-react"
import { useLeads } from "@/hooks/use-supabase-data"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const stages = [
  { id: "nuevo", name: "Nuevos", color: "bg-blue-500" },
  { id: "contactado", name: "Contactado", color: "bg-purple-500" },
  { id: "calificado", name: "Calificado", color: "bg-yellow-500" },
  { id: "cita_programada", name: "Cita Agendada", color: "bg-orange-500" },
  { id: "negociacion", name: "Negociación", color: "bg-pink-500" },
  { id: "cerrado", name: "Cerrado", color: "bg-green-500" },
]

// Map database status to display format
const statusMap: Record<string, string> = {
  nuevo: "nuevo",
  contactado: "contactado",
  calificado: "calificado",
  cita_programada: "cita_programada",
  negociacion: "negociacion",
  cerrado: "cerrado",
  // Legacy mappings
  new: "nuevo",
  contacted: "contactado",
  qualified: "calificado",
  appointment: "cita_programada",
  negotiation: "negociacion",
  closed: "cerrado",
}

const priorityLabels: Record<string, string> = {
  urgente: "Urgente",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
  // Legacy mappings
  urgent: "Urgente",
  high: "Alta",
  medium: "Media",
  low: "Baja",
}

export default function PipelinePage() {
  const { leads, loading, error } = useLeads()
  const [leadsByStage, setLeadsByStage] = useState<Record<string, any[]>>({
    nuevo: [],
    contactado: [],
    calificado: [],
    cita_programada: [],
    negociacion: [],
    cerrado: [],
  })

  const [draggedLead, setDraggedLead] = useState<any>(null)
  const [draggedFromStage, setDraggedFromStage] = useState<string | null>(null)

  // Group leads by status when data loads
  useEffect(() => {
    if (!leads) return

    const grouped: Record<string, any[]> = {
      nuevo: [],
      contactado: [],
      calificado: [],
      cita_programada: [],
      negociacion: [],
      cerrado: [],
    }

    leads.forEach((lead: any) => {
      const status = statusMap[lead.status || "nuevo"] || "nuevo"
      if (grouped[status]) {
        grouped[status].push(lead)
      }
    })

    setLeadsByStage(grouped)
  }, [leads])

  const handleDragStart = (lead: any, stageId: string) => {
    setDraggedLead(lead)
    setDraggedFromStage(stageId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetStageId: string) => {
    if (!draggedLead || !draggedFromStage) return

    // Update lead status in database
    try {
      const response = await fetch(`/api/leads/${draggedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStageId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update lead status')
      }

      // Update local state
      setLeadsByStage((prev) => {
        const newState = { ...prev }

        // Remove from old stage
        newState[draggedFromStage] = newState[draggedFromStage].filter((l) => l.id !== draggedLead.id)

        // Add to new stage
        const updatedLead = { ...draggedLead, status: targetStageId }
        newState[targetStageId] = [...newState[targetStageId], updatedLead]

        return newState
      })
    } catch (error) {
      console.error('Error updating lead status:', error)
      // Revert UI change on error
      alert('Error al actualizar el estado del lead. Por favor intenta de nuevo.')
    }

    setDraggedLead(null)
    setDraggedFromStage(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Pipeline de Ventas" subtitle="Cargando leads..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Pipeline de Ventas" subtitle="Error al cargar leads" />
        <div className="flex-1 px-8 pt-10 pb-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Pipeline de Ventas"
        subtitle="Arrastra leads entre etapas para actualizar su estado"
      />

      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color} flex-shrink-0`} />
                  <h3 className="text-sm font-semibold text-foreground truncate">{stage.name}</h3>
                  <Badge variant="secondary" className="ml-2">
                    {leadsByStage[stage.id]?.length || 0}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {leadsByStage[stage.id]?.map((lead) => (
                  <GlassCard
                    key={lead.id}
                    className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(lead, stage.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-foreground text-sm truncate">
                              {lead.name || "Lead sin nombre"}
                            </h4>
                            {lead.urgency_level && (
                              <Badge
                                variant={
                                  lead.urgency_level === "alta" || lead.urgency_level === "urgente" ? "destructive" : "secondary"
                                }
                                className="text-xs ml-2 flex-shrink-0"
                              >
                                {priorityLabels[lead.urgency_level] || lead.urgency_level}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{lead.vehicle_interest || "Sin vehículo especificado"}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{lead.phone || "Sin teléfono"}</span>
                        </div>
                        {lead.source && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate capitalize">{lead.source}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs bg-transparent" asChild>
                          <Link href={`/leads/${lead.id}`}>Ver</Link>
                        </Button>
                        <Button size="sm" className="h-7 text-xs flex-shrink-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </GlassCard>
                ))}

                {(!leadsByStage[stage.id] || leadsByStage[stage.id].length === 0) && (
                  <div className="text-center py-8 text-sm text-muted-foreground">No hay leads en esta etapa</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
