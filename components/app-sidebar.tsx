"use client"

import { useState, useEffect } from "react"
import { Home, Users, Calendar, Car, BarChart3, Settings, LogOut, Kanban, ClipboardList, User, ChevronLeft, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRole } from "@/lib/role-context"

const agentNavigation = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Tareas", href: "/dashboard/tasks", icon: ClipboardList },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Pipeline", href: "/dashboard/leads/pipeline", icon: Kanban },
  { name: "Citas", href: "/dashboard/appointments", icon: Calendar },
  { name: "Inventario", href: "/dashboard/inventory", icon: Car },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Perfil", href: "/dashboard/profile", icon: User },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

const dealerNavigation = [
  { name: "Dashboard", href: "/dealer/dashboard", icon: Home },
  { name: "Leads Activos", href: "/dealer/leads", icon: Users },
  { name: "Inventario", href: "/dealer/inventory", icon: Car },
  { name: "Citas", href: "/dealer/appointments", icon: Calendar },
  { name: "Reportes", href: "/dealer/reports", icon: BarChart3 },
  { name: "Configuración", href: "/dealer/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { role } = useRole()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const navigation = role === "dealer" ? dealerNavigation : agentNavigation

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col glass-nav border-r border-border transition-all duration-250 ease-out-ios",
        isCollapsed ? "w-16" : "w-64",
        isMobile && isCollapsed && "absolute left-0 z-50",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <Car className="w-5 h-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">Doctor del Crédito</span>
            <span className="text-xs text-muted-foreground truncate">AutoMax Miami</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto h-8 w-8 flex-shrink-0",
            isMobile && "hidden",
          )}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const navItem = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all",
                  isCollapsed ? "justify-center px-3 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navItem
          })}
        </TooltipProvider>
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">MR</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Maria Rodriguez</p>
            <p className="text-xs text-muted-foreground truncate">
              {role === "dealer" ? "Concesionario" : "Agente BDC"}
            </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center mb-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground">MR</AvatarFallback>
            </Avatar>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full bg-transparent",
            isCollapsed ? "justify-center px-2" : "justify-start gap-2",
          )}
          onClick={() => (window.location.href = "/login")}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  )
}
