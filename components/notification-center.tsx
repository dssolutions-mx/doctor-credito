"use client"

import { Bell } from "lucide-react"
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
  type: "lead" | "appointment" | "vehicle" | "task"
  title: string
  description: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "lead",
    title: "New lead from Facebook",
    description: "Carlos Martinez interested in 2024 Honda Civic",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "appointment",
    title: "Appointment in 30 minutes",
    description: "Roberto Silva - Test Drive at 10:00 AM",
    time: "28 min ago",
    read: false,
  },
  {
    id: "3",
    type: "vehicle",
    title: "New inventory added",
    description: "2020 Toyota Camry posted to Facebook",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "task",
    title: "Follow-up reminder",
    description: "Juan Perez - Civic sold, offer alternatives",
    time: "2 hours ago",
    read: true,
  },
]

export function NotificationCenter() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length

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
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {mockNotifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex-col items-start p-3 cursor-pointer">
              <div className="flex items-start gap-3 w-full">
                <div className={`mt-1 w-2 h-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight mb-1">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
