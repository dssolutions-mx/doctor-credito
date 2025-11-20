import { Badge } from "@/components/ui/badge"

// Default config to ensure we always have a valid config
const DEFAULT_CONFIG = { label: "Nuevo", variant: "default" as const }

// Database uses Spanish status values
const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  // Spanish database values
  nuevo: { label: "Nuevo", variant: "default" },
  contactado: { label: "Contactado", variant: "secondary" },
  calificado: { label: "Calificado", variant: "default" },
  cita: { label: "Cita", variant: "default" },
  negociacion: { label: "Negociación", variant: "secondary" },
  seguimiento: { label: "Seguimiento", variant: "outline" },
  cerrado: { label: "Cerrado", variant: "default" },
  vendido: { label: "Vendido", variant: "default" },
  perdido: { label: "Perdido", variant: "destructive" },
  no_interesado: { label: "No Interesado", variant: "destructive" },
  // English values (for backward compatibility)
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
  status: string | null | undefined
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  // Normalize status: trim whitespace, convert to lowercase
  const normalizedStatus = status?.toLowerCase()?.trim() || "nuevo"
  
  // Get config with fallback chain - always use DEFAULT_CONFIG as final fallback
  const config = statusConfig[normalizedStatus] || statusConfig["nuevo"] || DEFAULT_CONFIG
  
  // Double-check config exists (should never happen, but defensive programming)
  if (!config || typeof config !== "object" || !config.variant || !config.label) {
    console.warn(`Invalid status config for status: ${status}`, config)
    return <Badge variant={DEFAULT_CONFIG.variant}>{DEFAULT_CONFIG.label}</Badge>
  }
  
  return <Badge variant={config.variant}>{config.label}</Badge>
}
