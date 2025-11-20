"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Car, Loader2 } from "lucide-react"
import { useVehicles } from "@/hooks/use-supabase-data"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleDetailDialog } from "@/components/vehicle-detail-dialog"
import type { Vehicle } from "@/lib/types"
import Link from "next/link"

export default function DealerInventoryPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterMake, setFilterMake] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch vehicles from database
  const { vehicles, loading, error } = useVehicles()

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDialogOpen(true)
  }

  // Get unique makes for filter
  const makes = useMemo(() => {
    return Array.from(new Set(vehicles.map((v: any) => v.make))).sort()
  }, [vehicles])

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle: any) => {
      if (filterMake !== "all" && vehicle.make !== filterMake) return false
      if (filterStatus !== "all" && vehicle.status !== filterStatus) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchText =
          `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''} ${vehicle.stock_number}`.toLowerCase()
        if (!searchText.includes(query)) return false
      }
      return true
    })
  }, [vehicles, filterMake, filterStatus, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v: any) => v.status === "available").length,
      pending: vehicles.filter((v: any) => v.status === "pending").length,
      sold: vehicles.filter((v: any) => v.status === "sold").length,
    }
  }, [vehicles])

  const totalValue = useMemo(() => {
    return vehicles
      .filter((v: any) => v.status !== "sold")
      .reduce((sum: number, v: any) => sum + (v.price || 0), 0)
  }, [vehicles])

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Inventario" subtitle="Cargando..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando inventario...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Inventario" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center">
          <GlassCard className="max-w-md">
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-medium mb-2">Error al cargar inventario</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Inventario" subtitle={`${stats.available} vehículos disponibles`} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventario Total</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.available}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
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
                  placeholder="Buscar por marca, modelo, año o stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
              </div>
              <Select value={filterMake} onValueChange={setFilterMake}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Marcas</SelectItem>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild>
                <Link href="/dealer/inventory/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Vehículo
                </Link>
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVehicles.map((vehicle: any) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={{
                  ...vehicle,
                  images: vehicle.image_urls || [],
                  stock: vehicle.stock_number,
                  color: vehicle.exterior_color || 'N/A',
                }}
                onViewDetails={handleVehicleClick}
              />
            ))}
          </div>
        ) : (
          <GlassCard>
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {vehicles.length === 0
                  ? 'No hay vehículos en el inventario. Agrega tu primer vehículo.'
                  : 'No se encontraron vehículos que coincidan con tus filtros'}
              </p>
            </CardContent>
          </GlassCard>
        )}
      </div>

      {/* Vehicle Detail Dialog */}
      <VehicleDetailDialog vehicle={selectedVehicle} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

