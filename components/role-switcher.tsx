"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, UserCircle, Shield } from "lucide-react"
import { useRole } from "@/lib/role-context"
import { useRouter } from "next/navigation"

export function RoleSwitcher() {
  const { role, setRole } = useRole()
  const router = useRouter()

  const handleRoleChange = (newRole: "agent" | "dealer") => {
    setRole(newRole)
    // Redirect based on role
    if (newRole === "dealer") {
      router.push("/dealer/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {role === "agent" ? (
            <>
              <UserCircle className="h-4 w-4" />
              <span>Agente BDC</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              <span>Concesionario</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Cambiar Rol</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleRoleChange("agent")}
          className={role === "agent" ? "bg-accent" : ""}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Agente BDC</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleChange("dealer")}
          className={role === "dealer" ? "bg-accent" : ""}
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Concesionario</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
