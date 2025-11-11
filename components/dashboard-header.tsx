"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NotificationCenter } from "@/components/notification-center"
import { RoleSwitcher } from "@/components/role-switcher"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search leads, customers..." className="w-64 pl-9 h-9" />
          </div>

          <NotificationCenter />

          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}
