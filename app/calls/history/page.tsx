"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Search, Filter } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function CallHistoryPage() {
  const calls = [
    {
      id: "1",
      leadId: "1",
      leadName: "Maria Lopez",
      type: "outbound",
      status: "completed",
      duration: "8 min 42 sec",
      outcome: "Appointment Set",
      notes: "Discussed financing options. Booking appointment for Saturday.",
      timestamp: "Today, 2:34 PM",
    },
    {
      id: "2",
      leadId: "1",
      leadName: "Maria Lopez",
      type: "outbound",
      status: "no-answer",
      duration: "0 min",
      outcome: "No Answer",
      notes: "Left voicemail",
      timestamp: "Yesterday, 4:15 PM",
    },
    {
      id: "3",
      leadId: "3",
      leadName: "Carlos Martinez",
      type: "inbound",
      status: "completed",
      duration: "5 min 20 sec",
      outcome: "Qualified Lead",
      notes: "Good credit, interested in F-150, coming this week",
      timestamp: "Nov 8, 11:20 AM",
    },
    {
      id: "4",
      leadId: "4",
      leadName: "Ana Rodriguez",
      type: "outbound",
      status: "completed",
      duration: "12 min 15 sec",
      outcome: "Follow-up Needed",
      notes: "Needs to check with spouse, call back Thursday",
      timestamp: "Nov 7, 3:45 PM",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Call History" subtitle="View and manage all your call logs" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Filters */}
          <GlassCard>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search calls by name, outcome..." className="pl-9" />
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </GlassCard>

          {/* Call Log Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <GlassCard>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">32</div>
                <div className="text-sm text-muted-foreground">Total Calls</div>
              </CardContent>
            </GlassCard>
            <GlassCard>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-success">24</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </GlassCard>
            <GlassCard>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-warning">6</div>
                <div className="text-sm text-muted-foreground">No Answer</div>
              </CardContent>
            </GlassCard>
            <GlassCard>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">18 min</div>
                <div className="text-sm text-muted-foreground">Avg Duration</div>
              </CardContent>
            </GlassCard>
          </div>

          {/* Call List */}
          <div className="space-y-3">
            {calls.map((call) => (
              <GlassCard key={call.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          call.type === "inbound" ? "bg-primary/20" : "bg-secondary"
                        }`}
                      >
                        {call.type === "inbound" ? (
                          <PhoneIncoming className="h-5 w-5 text-primary" />
                        ) : call.status === "no-answer" ? (
                          <PhoneMissed className="h-5 w-5 text-warning" />
                        ) : (
                          <PhoneOutgoing className="h-5 w-5 text-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-foreground">{call.leadName}</h3>
                          <Badge variant={call.status === "completed" ? "default" : "secondary"}>{call.outcome}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {call.duration}
                          </span>
                          <span>{call.timestamp}</span>
                        </div>
                        {call.notes && <p className="text-sm text-muted-foreground">{call.notes}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Phone className="h-4 w-4" />
                        Call Again
                      </Button>
                      <Link href={`/dashboard/leads/${call.leadId}`}>
                        <Button size="sm" variant="ghost">
                          View Lead
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
