"use client"

import { NextStepProvider } from "nextstepjs"
import { ProductTour } from "./ProductTour"

interface OnboardingProviderProps {
  children: React.ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  return (
    <NextStepProvider>
      {children}
      <ProductTour />
    </NextStepProvider>
  )
}
