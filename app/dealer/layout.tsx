import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/lib/role-context"

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </RoleProvider>
  )
}



