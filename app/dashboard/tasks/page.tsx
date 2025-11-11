"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Clock, AlertCircle, CheckCircle2, Calendar, User } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const urgentTasks = [
    {
      id: "1",
      type: "call",
      title: "Call Maria Lopez",
      description: "Re: 2019 Honda Civic - No answer",
      dueTime: "2 hrs overdue",
      priority: "urgent",
      leadId: "1",
    },
    {
      id: "2",
      type: "confirm",
      title: "Confirm: Juan Perez",
      description: "Tomorrow 2pm - 2020 Toyota Camry",
      dueTime: "1 hr",
      priority: "urgent",
      leadId: "2",
    },
  ]

  const todayTasks = [
    {
      id: "3",
      type: "call",
      title: "Call new lead: Carlos Martinez",
      description: "Re: 2021 Ford F-150 - 12 mins ago",
      priority: "high",
      leadId: "3",
    },
    {
      id: "4",
      type: "follow-up",
      title: "Follow up: Ana Rodriguez",
      description: "No-show yesterday - Reschedule",
      priority: "high",
      leadId: "4",
    },
  ]

  const upcomingTasks = [
    {
      id: "5",
      type: "check-in",
      title: "Check in: Roberto Silva",
      description: "Weekly follow-up - Still shopping",
      dueDate: "Tomorrow",
      priority: "medium",
      leadId: "5",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Tareas" subtitle="Administra tus prioridades diarias y seguimientos" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Urgent Tasks */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <h2 className="text-lg font-semibold text-foreground">Urgent ({urgentTasks.length})</h2>
                </div>
                <div className="space-y-3">
                  {urgentTasks.map((task) => (
                    <GlassCard key={task.id} className="border-l-4 border-destructive">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Phone className="h-5 w-5 text-destructive" />
                              <h3 className="text-base font-semibold text-foreground">{task.title}</h3>
                              <Badge variant="destructive" className="text-xs">
                                {task.dueTime}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" className="gap-2">
                                <Phone className="h-4 w-4" />
                                Llamar Ahora
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                Posponer
                              </Button>
                              <Link href={`/dashboard/leads/${task.leadId}`}>
                                <Button variant="ghost" size="sm">
                                  Ver Lead
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Today's Priorities */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-warning" />
                  <h2 className="text-lg font-semibold text-foreground">Prioridades de Hoy ({todayTasks.length})</h2>
                </div>
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <GlassCard key={task.id} className="border-l-4 border-warning">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="h-5 w-5 text-warning" />
                              <h3 className="text-base font-semibold text-foreground">{task.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" className="gap-2">
                                <Phone className="h-4 w-4" />
                                Llamar
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                Mensaje
                              </Button>
                              <Link href={`/dashboard/leads/${task.leadId}`}>
                                <Button variant="ghost" size="sm">
                                  Ver Lead
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Upcoming ({upcomingTasks.length})</h2>
                </div>
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <GlassCard key={task.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">{task.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {task.dueDate}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                                <Phone className="h-4 w-4" />
                                Llamar
                              </Button>
                              <Button variant="ghost" size="sm">
                                Omitir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calls">
              <p className="text-sm text-muted-foreground">Call tasks filtered view...</p>
            </TabsContent>

            <TabsContent value="appointments">
              <p className="text-sm text-muted-foreground">Appointment tasks filtered view...</p>
            </TabsContent>

            <TabsContent value="followups">
              <p className="text-sm text-muted-foreground">Follow-up tasks filtered view...</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
