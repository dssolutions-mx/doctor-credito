import { Badge } from "@/components/ui/badge"
import type { LeadStatus } from "@/lib/types"

const statusConfig: Record<
  LeadStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  new: { label: "New", variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  qualified: { label: "Qualified", variant: "default" },
  appointment: { label: "Appointment", variant: "default" },
  negotiation: { label: "Negotiation", variant: "secondary" },
  "follow-up": { label: "Follow-up", variant: "outline" },
  closed: { label: "Closed", variant: "default" },
  lost: { label: "Lost", variant: "destructive" },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
