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
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react"
import { mockLeads, mockAppointments, mockCustomers } from "@/lib/mock-data"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

export default function ReportsPage() {
  // Calculate metrics
  const totalLeads = mockLeads.length
  const totalAppointments = mockAppointments.length
  const totalCustomers = mockCustomers.length
  const totalRevenue = mockCustomers.reduce(
    (sum, c) => sum + c.purchaseHistory.reduce((pSum, p) => pSum + p.salePrice, 0),
    0,
  )
  const conversionRate = ((mockCustomers.filter((c) => c.status === "active").length / totalLeads) * 100).toFixed(1)

  // Lead source data
  const leadSourceData = [
    { name: "Facebook", value: mockLeads.filter((l) => l.source === "facebook").length, color: "#3b82f6" },
    { name: "Website", value: mockLeads.filter((l) => l.source === "website").length, color: "#10b981" },
    { name: "Phone", value: mockLeads.filter((l) => l.source === "phone").length, color: "#f59e0b" },
    { name: "Referral", value: mockLeads.filter((l) => l.source === "referral").length, color: "#8b5cf6" },
  ]

  // Lead status funnel
  const leadFunnelData = [
    { stage: "New", count: mockLeads.filter((l) => l.status === "new").length },
    { stage: "Contacted", count: mockLeads.filter((l) => l.status === "contacted").length },
    { stage: "Qualified", count: mockLeads.filter((l) => l.status === "qualified").length },
    { stage: "Appointment", count: mockLeads.filter((l) => l.status === "appointment").length },
    { stage: "Closed", count: mockLeads.filter((l) => l.status === "closed").length },
  ]

  // Monthly performance (mock data)
  const monthlyPerformanceData = [
    { month: "Jul", leads: 18, appointments: 12, sales: 4, revenue: 142000 },
    { month: "Aug", leads: 22, appointments: 15, sales: 6, revenue: 189000 },
    { month: "Sep", leads: 25, appointments: 18, sales: 5, revenue: 165000 },
    { month: "Oct", leads: 20, appointments: 14, sales: 7, revenue: 224000 },
    { month: "Nov", leads: 28, appointments: 20, sales: 8, revenue: 267000 },
    { month: "Dec", leads: 24, appointments: 16, sales: 5, revenue: 178000 },
  ]

  // Appointment type distribution
  const appointmentTypeData = [
    { name: "Test Drive", value: mockAppointments.filter((a) => a.type === "test_drive").length, color: "#3b82f6" },
    {
      name: "Credit Approval",
      value: mockAppointments.filter((a) => a.type === "credit_approval").length,
      color: "#06b6d4",
    },
    { name: "Delivery", value: mockAppointments.filter((a) => a.type === "delivery").length, color: "#10b981" },
    { name: "Trade-in", value: mockAppointments.filter((a) => a.type === "trade_in").length, color: "#f59e0b" },
    { name: "Consultation", value: mockAppointments.filter((a) => a.type === "consultation").length, color: "#6b7280" },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Reportes y Análisis" subtitle="Rastrea el rendimiento y métricas" />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Period Selector */}
        <div className="flex justify-end">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <GlassCard>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalLeads}</div>
              <p className="text-xs text-success mt-1">+12% from last month</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalAppointments}</div>
              <p className="text-xs text-success mt-1">+8% from last month</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalCustomers}</div>
              <p className="text-xs text-success mt-1">+15% from last month</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${(totalRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-success mt-1">+22% from last month</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{conversionRate}%</div>
              <p className="text-xs text-success mt-1">+3.2% from last month</p>
            </CardContent>
          </GlassCard>
        </div>

        {/* Charts */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Monthly Performance Trend */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Leads, appointments, and revenue trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    leads: { label: "Leads", color: "hsl(var(--primary))" },
                    appointments: { label: "Appointments", color: "hsl(var(--accent))" },
                    sales: { label: "Sales", color: "hsl(var(--success))" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="leads"
                        stroke="var(--color-leads)"
                        strokeWidth={2}
                        name="Leads"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="appointments"
                        stroke="var(--color-appointments)"
                        strokeWidth={2}
                        name="Appointments"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="var(--color-sales)"
                        strokeWidth={2}
                        name="Sales"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </GlassCard>

            {/* Revenue Chart */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue ($)", color: "hsl(var(--primary))" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]} name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Lead Sources */}
              <GlassCard>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                  <CardDescription>Distribution of lead origins</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      facebook: { label: "Facebook", color: "#3b82f6" },
                      website: { label: "Website", color: "#10b981" },
                      phone: { label: "Phone", color: "#f59e0b" },
                      referral: { label: "Referral", color: "#8b5cf6" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {leadSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {leadSourceData.map((source) => (
                      <div key={source.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                        <span className="text-sm text-muted-foreground">
                          {source.name}: {source.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>

              {/* Lead Funnel */}
              <GlassCard>
                <CardHeader>
                  <CardTitle>Lead Conversion Funnel</CardTitle>
                  <CardDescription>Lead progression through sales stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: { label: "Leads", color: "hsl(var(--primary))" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadFunnelData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 8, 8, 0]} name="Leads" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </GlassCard>
            </div>

            {/* Lead Activity Metrics */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Lead Activity Metrics</CardTitle>
                <CardDescription>Communication and engagement statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10">
                    <Phone className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Calls</p>
                      <p className="text-2xl font-bold text-foreground">142</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/10">
                    <MessageSquare className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">SMS Sent</p>
                      <p className="text-2xl font-bold text-foreground">89</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-warning/10">
                    <Clock className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold text-foreground">12m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-success/10">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Follow-ups</p>
                      <p className="text-2xl font-bold text-foreground">67</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Appointment Types */}
              <GlassCard>
                <CardHeader>
                  <CardTitle>Appointment Types</CardTitle>
                  <CardDescription>Distribution by appointment type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      test_drive: { label: "Test Drive", color: "#3b82f6" },
                      credit_approval: { label: "Credit Approval", color: "#06b6d4" },
                      delivery: { label: "Delivery", color: "#10b981" },
                      trade_in: { label: "Trade-in", color: "#f59e0b" },
                      consultation: { label: "Consultation", color: "#6b7280" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={appointmentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {appointmentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </GlassCard>

              {/* Appointment Status */}
              <GlassCard>
                <CardHeader>
                  <CardTitle>Appointment Status</CardTitle>
                  <CardDescription>Current appointment statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-medium">Confirmed</span>
                      </div>
                      <span className="text-2xl font-bold text-success">
                        {mockAppointments.filter((a) => a.status === "confirmed").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-warning" />
                        <span className="font-medium">Pending</span>
                      </div>
                      <span className="text-2xl font-bold text-warning">
                        {mockAppointments.filter((a) => a.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Completed</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">
                        {mockAppointments.filter((a) => a.status === "completed").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </div>

            {/* Appointment Performance */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Appointment Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">Show-up Rate</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">92%</p>
                    <p className="text-xs text-muted-foreground mt-1">Above target of 85%</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Avg Duration</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">58min</p>
                    <p className="text-xs text-muted-foreground mt-1">Optimal range</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">Conversion</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">65%</p>
                    <p className="text-xs text-success mt-1">+8% from last month</p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Team Performance */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual agent performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    MR
                  </div>
                  <div>
                    <p className="font-medium">Maria Rodriguez</p>
                    <p className="text-sm text-muted-foreground">BDC Agent</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-8 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Leads</p>
                    <p className="text-xl font-bold text-foreground">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-xl font-bold text-foreground">16</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sales</p>
                    <p className="text-xl font-bold text-success">5</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion</p>
                    <p className="text-xl font-bold text-primary">21%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  )
}
