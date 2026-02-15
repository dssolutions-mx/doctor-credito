"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { useRole } from "@/lib/role-context"

export function RestartOnboardingButton() {
  const { role } = useRole()

  const handleRestart = () => {
    if (typeof window === "undefined") return

    localStorage.removeItem("nextstep_tour_agent-onboarding_completed")
    localStorage.removeItem("nextstep_tour_dealer-onboarding_completed")

    toast.success("Tour reiniciado", {
      description: "El tour se mostrará al recargar la página.",
    })

    const redirectTo = role === "dealer" ? "/dealer/dashboard" : "/dashboard"
    setTimeout(() => {
      window.location.href = redirectTo
    }, 500)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
      <HelpCircle className="h-4 w-4" />
      Ver guía de inicio
    </Button>
  )
}
