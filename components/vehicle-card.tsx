"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Vehicle } from "@/lib/types"
import { DollarSign, Gauge, Eye, Facebook, MoreVertical, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface VehicleCardProps {
  vehicle: Vehicle
  onViewDetails: (vehicle: Vehicle) => void
}

const statusConfig = {
  available: { label: "Disponible", variant: "default" as const },
  pending: { label: "Pendiente", variant: "secondary" as const },
  sold: { label: "Vendido", variant: "outline" as const },
}

export function VehicleCard({ vehicle, onViewDetails }: VehicleCardProps) {
  const router = useRouter()
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all glass-card group">
      {/* Vehicle Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <Image
          src={vehicle.images?.[0] || vehicle.image_urls?.[0] || vehicle.primary_image_url || "/placeholder.svg"}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={statusConfig[vehicle.status].variant}>{statusConfig[vehicle.status].label}</Badge>
          {vehicle.facebook_posted && (
            <Badge className="bg-[#1877F2] text-white">
              <Facebook className="h-3 w-3 mr-1" />
              FB
            </Badge>
          )}
        </div>
        {vehicle.mileage < 500 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent text-accent-foreground">Bajo Kilometraje</Badge>
          </div>
        )}
        {/* Actions Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(vehicle)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dealer/inventory/${vehicle.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dealer/inventory/${vehicle.id}/post-facebook`)}>
                <Facebook className="h-4 w-4 mr-2" />
                Publicar en Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Vehicle Title */}
        <div>
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-primary">${vehicle.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.mileage.toLocaleString()} millas</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Stock: {vehicle.stock_number || vehicle.stock || 'N/A'}</span>
          <span className="capitalize">{vehicle.exterior_color || vehicle.color || 'N/A'}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onViewDetails(vehicle)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalles
        </Button>
        {!vehicle.facebook_posted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/dealer/inventory/${vehicle.id}/post-facebook`)}
            title="Publicar en Facebook"
          >
            <Facebook className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
