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
      <div className="flex h-24 items-center justify-between px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] leading-[36px] font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-[15px] leading-[20px] text-muted-foreground mt-1.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar leads, clientes..." 
              className="w-72 pl-11 h-11 rounded-2xl text-[15px] leading-[20px]" 
            />
          </div>

          <NotificationCenter />

          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}
