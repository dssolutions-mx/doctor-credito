"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
} from "lucide-react"
import { mockLeads, mockAppointments, mockCustomers, mockVehicles } from "@/lib/mock-data"

export default function DealerReportsPage() {
  // Calculate metrics
  const totalLeads = mockLeads.length
  const totalAppointments = mockAppointments.length
  const totalCustomers = mockCustomers.length
  const totalRevenue = mockCustomers.reduce(
    (sum, c) => sum + c.purchaseHistory.reduce((pSum, p) => pSum + p.salePrice, 0),
    0,
  )
  const conversionRate = totalLeads > 0 ? ((totalCustomers / totalLeads) * 100).toFixed(1) : "0"
  const averageCommission = totalCustomers > 0 ? Math.round(totalRevenue * 0.1 / totalCustomers) : 0
  const costPerDeal = totalCustomers > 0 ? Math.round(480 / totalCustomers) : 0
  const roi = totalCustomers > 0 ? Math.round(((totalRevenue * 0.1 - 480) / 480) * 100) : 0

  // Lead funnel
  const leadFunnelData = [
    { stage: "Nuevos", count: mockLeads.filter((l) => l.status === "new").length },
    { stage: "Contactados", count: mockLeads.filter((l) => l.status === "contacted").length },
    { stage: "Calificados", count: mockLeads.filter((l) => l.status === "qualified").length },
    { stage: "Citas", count: mockLeads.filter((l) => l.status === "appointment").length },
    { stage: "Cerrados", count: mockLeads.filter((l) => l.status === "closed").length },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Reportes y Análisis" subtitle="Métricas de rendimiento y ROI" />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-3xl font-bold text-foreground">{totalLeads}</div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Citas Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-3xl font-bold text-foreground">{totalAppointments}</div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-success" />
                <div className="text-3xl font-bold text-success">{conversionRate}%</div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                <div className="text-3xl font-bold text-success">${(totalRevenue / 1000).toFixed(0)}K</div>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        {/* ROI Section */}
        <GlassCard>
          <CardHeader>
            <CardTitle>ROI y Rentabilidad</CardTitle>
            <CardDescription>Análisis de retorno de inversión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Deals Cerrados</p>
                <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Comisión Promedio</p>
                <p className="text-2xl font-bold text-success">${averageCommission}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Costo por Deal</p>
                <p className="text-2xl font-bold text-foreground">${costPerDeal}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-muted-foreground mb-1">ROI</p>
                <p className="text-3xl font-bold text-success">{roi}%</p>
                <p className="text-xs text-muted-foreground mt-1">Retorno sobre inversión en servicios BDC</p>
              </div>
            </div>
          </CardContent>
        </GlassCard>

        {/* Lead Funnel */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Embudo de Ventas</CardTitle>
            <CardDescription>Progreso de leads a través del pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadFunnelData.map((item, index) => {
                const percentage = totalLeads > 0 ? (item.count / totalLeads) * 100 : 0
                return (
                  <div key={item.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.stage}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  )
}

