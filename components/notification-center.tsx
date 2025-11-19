"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "lead" | "appointment" | "conversation" | "task"
  title: string
  description: string
  time: string
  read: boolean
  link?: string
}

export function NotificationCenter() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/notifications')
        if (!response.ok) throw new Error('Failed to fetch notifications')
        
        const data = await response.json()
        setNotifications(data.notifications || [])
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setReadNotifications(prev => new Set(prev).add(notification.id))
    
    // Navigate if link exists
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const unreadNotifications = notifications.filter(
    (n) => !n.read && !readNotifications.has(n.id)
  )
  const unreadCount = unreadNotifications.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} nuevos
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-muted-foreground">No hay notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isRead = notification.read || readNotifications.has(notification.id)
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex-col items-start p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`mt-1 w-2 h-2 rounded-full ${isRead ? "bg-muted" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight mb-1">{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center cursor-pointer">
          Ver todas las notificaciones
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
