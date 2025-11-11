import type React from "react"
import { RoleProvider } from "@/lib/role-context"

export default function CallsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleProvider>{children}</RoleProvider>
}

