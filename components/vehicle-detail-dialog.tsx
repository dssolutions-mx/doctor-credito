"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import type { Vehicle } from "@/lib/types"
import { Gauge, Calendar, Palette, Hash, ChevronLeft, ChevronRight, Edit, Facebook, Trash2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
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
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [updating, setUpdating] = useState(false)

  if (!vehicle) return null

  const vehicleImages = vehicle.images || vehicle.image_urls || []
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length)
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/inventory/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar estado")
      }

      toast.success(`Vehículo marcado como ${newStatus === 'available' ? 'disponible' : newStatus === 'pending' ? 'pendiente' : 'vendido'}`)
      onOpenChange(false)
      window.location.reload() // Refresh to show updated data
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error(error instanceof Error ? error.message : "Error al actualizar estado")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/inventory/${vehicle.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar vehículo")
      }

      toast.success("Vehículo eliminado exitosamente")
      setShowDeleteDialog(false)
      onOpenChange(false)
      router.push("/dealer/inventory")
      window.location.reload()
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast.error(error instanceof Error ? error.message : "Error al eliminar vehículo")
    }
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
              src={(vehicle.images || vehicle.image_urls || [])[currentImageIndex] || vehicle.primary_image_url || "/placeholder.svg"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
            />
            {(vehicle.images || vehicle.image_urls || []).length > 1 && (
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
                  {(vehicle.images || vehicle.image_urls || []).map((_, idx) => (
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
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/dealer/inventory/${vehicle.id}/edit`)
                }}
                disabled={updating}
              >
                <Edit className="h-4 w-4" />
                Editar Vehículo
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent gap-2"
                size="lg"
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/dealer/inventory/${vehicle.id}/post-facebook`)
                }}
                disabled={updating}
              >
                <Facebook className="h-4 w-4" />
                Publicar en Facebook
              </Button>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Cambiar Estado</p>
                <div className="space-y-2">
                  {vehicle.status !== "available" && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                      size="sm"
                      onClick={() => handleStatusUpdate("available")}
                      disabled={updating}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marcar como Disponible
                    </Button>
                  )}
                  {vehicle.status !== "pending" && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                      size="sm"
                      onClick={() => handleStatusUpdate("pending")}
                      disabled={updating}
                    >
                      <Calendar className="h-4 w-4" />
                      Marcar como Pendiente
                    </Button>
                  )}
                  {vehicle.status !== "sold" && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                      size="sm"
                      onClick={() => handleStatusUpdate("sold")}
                      disabled={updating}
                    >
                      <XCircle className="h-4 w-4" />
                      Marcar como Vendido
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={updating}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar Vehículo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El vehículo será eliminado permanentemente del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
