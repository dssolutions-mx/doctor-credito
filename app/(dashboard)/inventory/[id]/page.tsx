"use client"

import { useState, use } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Share2 } from "lucide-react"
import Link from "next/link"
import { mockVehicles } from "@/lib/mock-data"
import { VehicleShareDialog } from "@/components/vehicle-share-dialog"
import { FacebookPostIntegration } from "@/components/facebook-post-integration"

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const vehicle = mockVehicles.find((v) => v.id === id) || mockVehicles[0]
  const [showShareDialog, setShowShareDialog] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Detalles del Vehículo" subtitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/inventory">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Inventario
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent text-destructive">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>

          <GlassCard>
            <CardContent className="p-0">
              <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                <img
                  src={vehicle.images[0] || "/placeholder.svg"}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-xl text-muted-foreground">{vehicle.trim}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-success">${vehicle.price.toLocaleString()}</p>
                    <Badge
                      variant={
                        vehicle.status === "available"
                          ? "default"
                          : vehicle.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                      className="mt-2"
                    >
                      {vehicle.status === "available" ? "Disponible" : vehicle.status === "pending" ? "Pendiente" : "Vendido"}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Número de Stock</p>
                    <p className="font-semibold text-foreground">{vehicle.stock}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">VIN</p>
                    <p className="font-semibold text-foreground font-mono text-sm">{vehicle.vin}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Kilometraje</p>
                    <p className="font-semibold text-foreground">{vehicle.mileage.toLocaleString()} millas</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Color</p>
                    <p className="font-semibold text-foreground">{vehicle.color}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Año</p>
                    <p className="font-semibold text-foreground">{vehicle.year}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Marca/Modelo</p>
                    <p className="font-semibold text-foreground">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                </div>

                <Button onClick={() => setShowShareDialog(true)} className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartir con Cliente
                </Button>
              </div>
            </CardContent>
          </GlassCard>

          <FacebookPostIntegration vehicle={vehicle} />
        </div>
      </div>

      <VehicleShareDialog vehicle={vehicle} open={showShareDialog} onOpenChange={setShowShareDialog} />
    </div>
  )
}
