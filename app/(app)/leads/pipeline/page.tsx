"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, GripVertical } from "lucide-react"
import { mockLeads } from "@/lib/mock-data"
import Link from "next/link"

const stages = [
  { id: "new", name: "Nuevos", color: "bg-blue-500" },
  { id: "contacted", name: "Contactado", color: "bg-purple-500" },
  { id: "qualified", name: "Calificado", color: "bg-yellow-500" },
  { id: "appointment", name: "Cita Agendada", color: "bg-orange-500" },
  { id: "negotiation", name: "Negociación", color: "bg-pink-500" },
  { id: "closed", name: "Cerrado", color: "bg-green-500" },
]

const priorityLabels = {
  urgent: "Urgente",
  high: "Alta",
  medium: "Media",
  low: "Baja",
}

export default function PipelinePage() {
  const [leadsByStage, setLeadsByStage] = useState(() => {
    const grouped: Record<string, typeof mockLeads> = {
      new: [],
      contacted: [],
      qualified: [],
      appointment: [],
      negotiation: [],
      closed: [],
    }

    mockLeads.forEach((lead) => {
      const status = lead.status || "new"
      if (grouped[status]) {
        grouped[status].push(lead)
      }
    })

    return grouped
  })

  const [draggedLead, setDraggedLead] = useState<any>(null)
  const [draggedFromStage, setDraggedFromStage] = useState<string | null>(null)

  const handleDragStart = (lead: any, stageId: string) => {
    setDraggedLead(lead)
    setDraggedFromStage(stageId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetStageId: string) => {
    if (!draggedLead || !draggedFromStage) return

    setLeadsByStage((prev) => {
      const newState = { ...prev }

      // Remove from old stage
      newState[draggedFromStage] = newState[draggedFromStage].filter((l) => l.id !== draggedLead.id)

      // Add to new stage
      const updatedLead = { ...draggedLead, status: targetStageId }
      newState[targetStageId] = [...newState[targetStageId], updatedLead]

      return newState
    })

    setDraggedLead(null)
    setDraggedFromStage(null)
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
                              {lead.firstName} {lead.lastName}
                            </h4>
                            <Badge
                              variant={
                                lead.priority === "high" || lead.priority === "urgent" ? "destructive" : "secondary"
                              }
                              className="text-xs ml-2 flex-shrink-0"
                            >
                              {priorityLabels[lead.priority as keyof typeof priorityLabels]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{lead.vehicleInterest}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
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
