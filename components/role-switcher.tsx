"use client"

import { Badge } from "@/components/ui/badge"
import { UserCircle, Shield, Crown } from "lucide-react"
import { useRole } from "@/lib/role-context"

export function RoleSwitcher() {
  const { role } = useRole()

  const roleConfig = {
    agent: {
      icon: UserCircle,
      label: "Agente BDC",
      variant: "secondary" as const,
    },
    dealer: {
      icon: Shield,
      label: "Concesionario",
      variant: "outline" as const,
    },
    admin: {
      icon: Crown,
      label: "Administrador",
      variant: "default" as const,
    },
  }

  const config = roleConfig[role] || roleConfig.agent
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-2 px-3 py-1.5">
      <Icon className="h-4 w-4" />
      <span>{config.label}</span>
    </Badge>
  )
}
