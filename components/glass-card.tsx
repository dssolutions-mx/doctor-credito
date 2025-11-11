import type React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <Card className={cn("glass-card shadow-elevation-1", className)} {...props}>
      {children}
    </Card>
  )
}
