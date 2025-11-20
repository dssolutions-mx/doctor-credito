"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/image-uploader"
import { uploadMultipleVehicleImages } from "@/lib/storage-helpers"
import { Loader2, Save, X, Plus } from "lucide-react"
import { toast } from "sonner"

interface ImageFile {
  file: File
  preview: string
  id: string
}

export default function NewVehiclePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    vin: "",
    stock_number: "",
    year: new Date().getFullYear(),
    make: "",
    model: "",
    trim: "",
    body_style: "",

    // Specifications
    transmission: "",
    fuel_type: "",
    drivetrain: "",
    exterior_color: "",
    interior_color: "",
    engine: "",
    mileage: "",

    // Pricing
    cost: "",
    price: "",
    sale_price: "",

    // Marketing
    marketing_title: "",
    description: "",
    features: [] as string[],

    // Status
    status: "available",
    condition: "used",
  })

  const [newFeature, setNewFeature] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (!newFeature.trim()) return
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }))
    setNewFeature("")
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.vin.trim()) {
      toast.error("El VIN es requerido")
      return
    }
    if (!formData.stock_number.trim()) {
      toast.error("El número de stock es requerido")
      return
    }
    if (!formData.make.trim() || !formData.model.trim()) {
      toast.error("Marca y modelo son requeridos")
      return
    }
    if (!formData.price) {
      toast.error("El precio es requerido")
      return
    }
    if (!formData.mileage) {
      toast.error("El kilometraje es requerido")
      return
    }

    try {
      setLoading(true)

      // Step 1: Create vehicle first
      const vehiclePayload = {
        vin: formData.vin.trim(),
        stock_number: formData.stock_number.trim(),
        year: formData.year,
        make: formData.make.trim(),
        model: formData.model.trim(),
        trim: formData.trim.trim() || null,
        body_style: formData.body_style || null,
        transmission: formData.transmission || null,
        fuel_type: formData.fuel_type || null,
        drivetrain: formData.drivetrain || null,
        exterior_color: formData.exterior_color || null,
        interior_color: formData.interior_color || null,
        engine: formData.engine.trim() || null,
        mileage: parseInt(formData.mileage),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        marketing_title: formData.marketing_title.trim() || null,
        description: formData.description.trim() || null,
        features: formData.features,
        status: formData.status,
        condition: formData.condition,
      }

      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiclePayload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear el vehículo")
      }

      const { vehicle } = await response.json()

      // Step 2: Upload images if any
      if (images.length > 0) {
        toast.info("Subiendo imágenes...")

        const { urls, errors } = await uploadMultipleVehicleImages(
          images.map((img) => img.file),
          vehicle.id
        )

        if (errors.length > 0) {
          console.error("Some images failed to upload:", errors)
          toast.warning(`${errors.length} imagen(es) no se pudieron subir`)
        }

        // Step 3: Update vehicle with image URLs
        if (urls.length > 0) {
          const updateResponse = await fetch(`/api/inventory/${vehicle.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_urls: urls,
              primary_image_url: urls[0],
            }),
          })

          if (!updateResponse.ok) {
            // If image update fails, delete the vehicle to rollback
            await fetch(`/api/inventory/${vehicle.id}`, {
              method: "DELETE",
            })
            throw new Error("Error al actualizar imágenes. El vehículo no fue creado.")
          }
        } else if (errors.length === images.length) {
          // All images failed, rollback vehicle creation
          await fetch(`/api/inventory/${vehicle.id}`, {
            method: "DELETE",
          })
          throw new Error("Error al subir imágenes. El vehículo no fue creado.")
        }
      }

      toast.success("Vehículo creado exitosamente")
      router.push("/dealer/inventory")
    } catch (error) {
      console.error("Error creating vehicle:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear el vehículo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Agregar Vehículo"
        subtitle="Completa la información del vehículo"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Images */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Imágenes del Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader images={images} onChange={setImages} maxImages={10} />
            </CardContent>
          </GlassCard>

          {/* Basic Info */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN *</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_number">Número de Stock *</Label>
                  <Input
                    id="stock_number"
                    value={formData.stock_number}
                    onChange={(e) => handleInputChange("stock_number", e.target.value)}
                    placeholder="820734"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Año *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="make">Marca *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    placeholder="Honda"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Accord"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trim">Versión</Label>
                  <Input
                    id="trim"
                    value={formData.trim}
                    onChange={(e) => handleInputChange("trim", e.target.value)}
                    placeholder="EX-L"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body_style">Tipo de Carrocería</Label>
                  <Select value={formData.body_style} onValueChange={(v) => handleInputChange("body_style", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Truck">Camioneta</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Specifications */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmisión</Label>
                  <Select value={formData.transmission} onValueChange={(v) => handleInputChange("transmission", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automática</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel_type">Tipo de Combustible</Label>
                  <Select value={formData.fuel_type} onValueChange={(v) => handleInputChange("fuel_type", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasolina</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Híbrido</SelectItem>
                      <SelectItem value="Electric">Eléctrico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drivetrain">Tracción</Label>
                  <Select value={formData.drivetrain} onValueChange={(v) => handleInputChange("drivetrain", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FWD">FWD (Delantera)</SelectItem>
                      <SelectItem value="RWD">RWD (Trasera)</SelectItem>
                      <SelectItem value="AWD">AWD (4x4)</SelectItem>
                      <SelectItem value="4WD">4WD (4x4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exterior_color">Color Exterior</Label>
                  <Input
                    id="exterior_color"
                    value={formData.exterior_color}
                    onChange={(e) => handleInputChange("exterior_color", e.target.value)}
                    placeholder="Blanco"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interior_color">Color Interior</Label>
                  <Input
                    id="interior_color"
                    value={formData.interior_color}
                    onChange={(e) => handleInputChange("interior_color", e.target.value)}
                    placeholder="Negro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilometraje *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engine">Motor</Label>
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) => handleInputChange("engine", e.target.value)}
                  placeholder="2.0L 4-Cylinder Turbo"
                />
              </div>
            </CardContent>
          </GlassCard>

          {/* Pricing */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo (Interno)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="15000.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="21599.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_price">Precio de Oferta</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => handleInputChange("sale_price", e.target.value)}
                    placeholder="19999.00"
                  />
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Marketing */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Marketing y Descripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="marketing_title">Título de Marketing</Label>
                <Input
                  id="marketing_title"
                  value={formData.marketing_title}
                  onChange={(e) => handleInputChange("marketing_title", e.target.value)}
                  placeholder="Honda Accord 2019 - Excelente Estado, Bajo Kilometraje"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe el vehículo, su condición, características especiales..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Características</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ej: Sistema de Navegación"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-muted px-3 py-1 rounded-md flex items-center gap-2 text-sm"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </GlassCard>

          {/* Status */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado del Vehículo</Label>
                  <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="sold">Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condición</Label>
                  <Select value={formData.condition} onValueChange={(v) => handleInputChange("condition", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nuevo</SelectItem>
                      <SelectItem value="used">Usado</SelectItem>
                      <SelectItem value="certified">Certificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Vehículo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
