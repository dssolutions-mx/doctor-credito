"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Car, Calendar } from "lucide-react"
import { mockLeads, mockAppointments, mockVehicles, mockCustomers } from "@/lib/mock-data"

export default function DealerDashboardPage() {
  const totalRevenue = mockCustomers.reduce(
    (sum, customer) => sum + customer.purchaseHistory.reduce((pSum, purchase) => pSum + purchase.salePrice, 0),
    0,
  )

  const soldVehicles = mockVehicles.filter((v) => v.status === "sold").length
  const activeLeads = mockLeads.filter((l) => l.status !== "closed").length
  const todayAppointments = mockAppointments.length

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Dealer Dashboard" subtitle="Overview of dealership performance and operations" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div id="dealer-metrics" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground mt-2">${(totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-success mt-1">+12.5% vs last month</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicles Sold</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{soldVehicles}</p>
                    <p className="text-xs text-success mt-1">+8.3% vs last month</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Leads</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{activeLeads}</p>
                    <p className="text-xs text-warning mt-1">15 need follow-up</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{todayAppointments}</p>
                    <p className="text-xs text-muted-foreground mt-1">Scheduled this week</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>

          {/* Team Performance */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Maria Rodriguez", leads: 24, conversions: 8, revenue: 245000 },
                  { name: "Carlos Mendez", leads: 19, conversions: 6, revenue: 198000 },
                  { name: "Ana Garcia", leads: 16, conversions: 5, revenue: 175000 },
                ].map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.leads} leads • {agent.conversions} conversions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${(agent.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-success">Revenue generated</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Inventory Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Vehicles</span>
                    <span className="font-semibold text-foreground">{mockVehicles.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <span className="font-semibold text-success">
                      {mockVehicles.filter((v) => v.status === "available").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-semibold text-warning">
                      {mockVehicles.filter((v) => v.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sold This Month</span>
                    <span className="font-semibold text-foreground">{soldVehicles}</span>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Facebook</span>
                    <span className="font-semibold text-foreground">
                      {mockLeads.filter((l) => l.source === "facebook").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Website</span>
                    <span className="font-semibold text-foreground">
                      {mockLeads.filter((l) => l.source === "website").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Referral</span>
                    <span className="font-semibold text-foreground">
                      {mockLeads.filter((l) => l.source === "referral").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
