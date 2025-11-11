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
      <div className={cn(
        "flex h-16 items-center border-b border-border",
        isCollapsed ? "justify-center px-2" : "gap-3 px-6"
      )}>
        <div className={cn(
          "bg-primary rounded-2xl flex items-center justify-center flex-shrink-0",
          isCollapsed ? "w-10 h-10" : "w-10 h-10"
        )}>
          <Car className="w-5 h-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] leading-[20px] font-semibold text-foreground truncate">Doctor del Crédito</span>
          <span className="text-[13px] leading-[18px] text-muted-foreground truncate">AutoMax Miami</span>
        </div>
        )}
        {!isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto h-9 w-9 flex-shrink-0 rounded-xl",
            isMobile && "hidden",
          )}
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto",
        isCollapsed ? "space-y-2 px-2 py-4" : "space-y-1 p-4"
      )}>
        <TooltipProvider delayDuration={0}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
            const navItem = (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                  "flex items-center rounded-2xl text-[15px] leading-[20px] font-medium transition-all",
                  isCollapsed ? "justify-center h-11 w-11" : "gap-3 px-4 py-3",
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
                  <TooltipContent side="right" className="text-[15px] leading-[20px]">
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
      <div className={cn(
        "border-t border-border",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {!isCollapsed && (
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-11 w-11 border-2 border-primary/10 flex-shrink-0 rounded-2xl">
            <AvatarFallback className="bg-primary text-primary-foreground text-[15px] font-semibold rounded-2xl">MR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] leading-[20px] font-semibold text-foreground truncate">Maria Rodriguez</p>
            <p className="text-[13px] leading-[18px] text-muted-foreground truncate">
              {role === "dealer" ? "Concesionario" : "Agente BDC"}
            </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center mb-3">
            <Avatar className="h-11 w-11 border-2 border-primary/10 rounded-2xl">
              <AvatarFallback className="bg-primary text-primary-foreground text-[15px] font-semibold rounded-2xl">MR</AvatarFallback>
            </Avatar>
        </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "bg-transparent rounded-2xl border-border",
            isCollapsed ? "h-11 w-11 justify-center p-0" : "w-full h-10 justify-start gap-2 px-4",
          )}
          onClick={() => (window.location.href = "/login")}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-[15px] leading-[20px] truncate">Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  )
}
