"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Vehicle } from "@/lib/types"
import { Gauge, Calendar, Palette, Hash, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface VehicleDetailDialogProps {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig = {
  available: { label: "Disponible", variant: "default" as const },
  pending: { label: "Pendiente", variant: "secondary" as const },
  sold: { label: "Vendido", variant: "outline" as const },
}

export function VehicleDetailDialog({ vehicle, open, onOpenChange }: VehicleDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!vehicle) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">{vehicle.trim}</p>
            </div>
            <Badge variant={statusConfig[vehicle.status].variant}>{statusConfig[vehicle.status].label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image Gallery */}
          <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden">
            <Image
              src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
            />
            {vehicle.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {vehicle.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
            <span className="text-lg font-medium text-foreground">Precio</span>
            <span className="text-3xl font-bold text-primary">${vehicle.price.toLocaleString()}</span>
          </div>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalles del Vehículo</TabsTrigger>
              <TabsTrigger value="actions">Acciones</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Año</span>
                  </div>
                  <p className="text-base font-medium">{vehicle.year}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span>Kilometraje</span>
                  </div>
                  <p className="text-base font-medium">{vehicle.mileage.toLocaleString()} millas</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    <span>Color</span>
                  </div>
                  <p className="text-base font-medium capitalize">{vehicle.color}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>Número de Stock</span>
                  </div>
                  <p className="text-base font-medium">{vehicle.stock}</p>
                </div>
              </div>

              {/* VIN */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">VIN</span>
                  <span className="text-sm font-mono font-medium">{vehicle.vin}</span>
                </div>
              </div>

              {/* Full Specifications */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-semibold text-foreground">Especificaciones Completas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marca</span>
                    <span className="font-medium">{vehicle.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modelo</span>
                    <span className="font-medium">{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versión</span>
                    <span className="font-medium">{vehicle.trim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <Badge variant={statusConfig[vehicle.status].variant}>{statusConfig[vehicle.status].label}</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-3">
              <Button className="w-full" size="lg">
                Asignar a Lead
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                Programar Prueba de Manejo
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                Imprimir Hoja de Especificaciones
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                Compartir Vehículo
              </Button>
              {vehicle.status === "available" && (
                <Button variant="secondary" className="w-full" size="lg">
                  Marcar como Pendiente
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
