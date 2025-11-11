"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/lib/types"
import { DollarSign, Gauge, Eye } from "lucide-react"
import Image from "next/image"

interface VehicleCardProps {
  vehicle: Vehicle
  onViewDetails: (vehicle: Vehicle) => void
}

const statusConfig = {
  available: { label: "Available", variant: "default" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  sold: { label: "Sold", variant: "outline" as const },
}

export function VehicleCard({ vehicle, onViewDetails }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all glass-card">
      {/* Vehicle Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <Image
          src={vehicle.images[0] || "/placeholder.svg"}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={statusConfig[vehicle.status].variant}>{statusConfig[vehicle.status].label}</Badge>
        </div>
        {vehicle.mileage < 500 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent text-accent-foreground">Low Mileage</Badge>
          </div>
        )}
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
            <span className="text-muted-foreground">{vehicle.mileage.toLocaleString()} mi</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Stock: {vehicle.stock}</span>
          <span className="capitalize">{vehicle.color}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full bg-transparent" onClick={() => onViewDetails(vehicle)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
