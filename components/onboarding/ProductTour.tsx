"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { NextStepReact, useNextStep } from "nextstepjs"
import { useNextAdapter } from "nextstepjs/adapters/next"
import { useRole } from "@/lib/role-context"
import { getTourStepsForRole } from "./tour-steps"

const waitForSelector = (
  selector: string | undefined,
  attempt = 0,
  maxAttempts = 15,
  delay = 200,
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!selector || typeof document === "undefined") return resolve(true)
    const el = document.querySelector(selector)
    if (el) return resolve(true)
    if (attempt >= maxAttempts) return resolve(false)
    setTimeout(() => {
      resolve(waitForSelector(selector, attempt + 1, maxAttempts, delay))
    }, delay)
  })
}

export function ProductTour() {
  const { role } = useRole()
  const { startNextStep } = useNextStep()
  const pathname = usePathname()

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/reset-password") ||
    pathname === "/"

  const tourSteps = getTourStepsForRole(role)
  const tourId = tourSteps[0]?.tour ?? "agent-onboarding"

  useEffect(() => {
    const checkAndStartTour = async () => {
      if (isAuthPage) return
      if (!role) return
      if (tourSteps.length === 0) return

      const completionKey = `nextstep_tour_${tourId}_completed`
      const completed = typeof window !== "undefined" && localStorage.getItem(completionKey) === "true"
      if (completed) return

      const isDashboardRoute =
        pathname === "/dashboard" || pathname === "/dealer/dashboard"
      if (!isDashboardRoute) return

      const firstStepSelector = tourSteps[0]?.steps?.[0]?.selector
      const found = await waitForSelector(firstStepSelector, 0, 15, 200)

      if (!found && firstStepSelector) return

      setTimeout(() => {
        try {
          startNextStep(tourId)
        } catch (error) {
          console.error("ProductTour: Error starting tour", error)
        }
      }, 500)
    }

    const timeoutId = setTimeout(checkAndStartTour, 500)
    return () => clearTimeout(timeoutId)
  }, [isAuthPage, role, pathname, tourId, tourSteps, startNextStep])

  const scrollToSelector = async (selector?: string) => {
    if (!selector || typeof document === "undefined") return
    const found = await waitForSelector(selector, 0, 20, 200)
    if (!found) return
    const el = document.querySelector(selector) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    }
  }

  if (isAuthPage || tourSteps.length === 0) {
    return null
  }

  return (
    <NextStepReact
      steps={tourSteps}
      navigationAdapter={useNextAdapter}
      cardTransition={{ duration: 0.3, type: "spring" }}
      shadowOpacity="0.6"
      overlayZIndex={999}
      onStepChange={async (stepIndex, tourName) => {
        const tour = tourSteps.find((t) => t.tour === tourName)
        const step = tour?.steps?.[stepIndex]
        if (step?.selector) {
          await scrollToSelector(step.selector)
        }
      }}
      onComplete={(completedTourId) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(`nextstep_tour_${completedTourId}_completed`, "true")
        }
      }}
      onSkip={(skippedTourId) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(`nextstep_tour_${skippedTourId}_completed`, "true")
        }
      }}
    />
  )
}
