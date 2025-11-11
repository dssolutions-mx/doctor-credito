"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, TrendingUp } from "lucide-react"
import { mockCustomers } from "@/lib/mock-data"
import { CustomerProfileCard } from "@/components/customer-profile-card"
import { CustomerDetailSheet } from "@/components/customer-detail-sheet"
import type { Customer } from "@/lib/types"

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsSheetOpen(true)
  }

  // Filter customers
  const filteredCustomers = mockCustomers.filter((customer) => {
    if (filterStatus !== "all" && customer.status !== filterStatus) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const searchText = `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phone}`.toLowerCase()
      if (!searchText.includes(query)) return false
    }
    return true
  })

  // Calculate stats
  const stats = {
    total: mockCustomers.length,
    active: mockCustomers.filter((c) => c.status === "active").length,
    potential: mockCustomers.filter((c) => c.status === "potential").length,
    totalRevenue: mockCustomers.reduce(
      (sum, c) => sum + c.purchaseHistory.reduce((pSum, p) => pSum + p.salePrice, 0),
      0,
    ),
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Customers" subtitle={`${stats.active} active customers`} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.active}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.potential}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <div className="text-2xl font-bold text-primary">${(stats.totalRevenue / 1000).toFixed(0)}K</div>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="potential">Potential</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Customer Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <CustomerProfileCard key={customer.id} customer={customer} onViewDetails={handleCustomerClick} />
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <GlassCard>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customers found matching your filters</p>
            </CardContent>
          </GlassCard>
        )}
      </div>

      {/* Customer Detail Sheet */}
      <CustomerDetailSheet customer={selectedCustomer} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  )
}
