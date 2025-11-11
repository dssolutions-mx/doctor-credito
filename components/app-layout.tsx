"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/lib/role-context"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </RoleProvider>
  )
}

