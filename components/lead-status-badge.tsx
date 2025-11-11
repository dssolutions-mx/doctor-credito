import { Badge } from "@/components/ui/badge"
import type { LeadStatus } from "@/lib/types"

const statusConfig: Record<
  LeadStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  new: { label: "Nuevo", variant: "default" },
  contacted: { label: "Contactado", variant: "secondary" },
  qualified: { label: "Calificado", variant: "default" },
  appointment: { label: "Cita", variant: "default" },
  negotiation: { label: "Negociación", variant: "secondary" },
  "follow-up": { label: "Seguimiento", variant: "outline" },
  closed: { label: "Cerrado", variant: "default" },
  lost: { label: "Perdido", variant: "destructive" },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
