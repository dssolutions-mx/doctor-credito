"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Car } from "lucide-react"
import { mockVehicles } from "@/lib/mock-data"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleDetailDialog } from "@/components/vehicle-detail-dialog"
import type { Vehicle } from "@/lib/types"

export default function InventoryPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterMake, setFilterMake] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDialogOpen(true)
  }

  // Get unique makes for filter
  const makes = Array.from(new Set(mockVehicles.map((v) => v.make))).sort()

  // Filter vehicles
  const filteredVehicles = mockVehicles.filter((vehicle) => {
    if (filterMake !== "all" && vehicle.make !== filterMake) return false
    if (filterStatus !== "all" && vehicle.status !== filterStatus) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const searchText =
        `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.stock}`.toLowerCase()
      if (!searchText.includes(query)) return false
    }
    return true
  })

  // Calculate stats
  const stats = {
    total: mockVehicles.length,
    available: mockVehicles.filter((v) => v.status === "available").length,
    pending: mockVehicles.filter((v) => v.status === "pending").length,
    sold: mockVehicles.filter((v) => v.status === "sold").length,
  }

  const totalValue = mockVehicles.filter((v) => v.status !== "sold").reduce((sum, v) => sum + v.price, 0)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Inventory" subtitle={`${stats.available} vehicles available`} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.available}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${(totalValue / 1000).toFixed(0)}K</div>
            </CardContent>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by make, model, year, or stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
              </div>
              <Select value={filterMake} onValueChange={setFilterMake}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Vehicle Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={handleVehicleClick} />
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <GlassCard>
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vehicles found matching your filters</p>
            </CardContent>
          </GlassCard>
        )}
      </div>

      {/* Vehicle Detail Dialog */}
      <VehicleDetailDialog vehicle={selectedVehicle} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
