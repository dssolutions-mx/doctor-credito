"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * Redirects to /appointments with query params to auto-open the create dialog.
 * The /appointments/book page is deprecated - all "Agendar Cita" links now go to /appointments?new=1
 */
export default function BookAppointmentRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const leadId = searchParams.get("lead_id")
    const params = new URLSearchParams({ new: "1" })
    if (leadId) params.set("lead_id", leadId)
    router.replace(`/appointments?${params.toString()}`)
  }, [router, searchParams])

  return null
}
