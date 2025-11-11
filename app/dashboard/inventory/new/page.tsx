"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Camera } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewInventoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postToFacebook, setPostToFacebook] = useState(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to inventory page
    router.push("/dashboard/inventory")
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Agregar Nuevo Vehículo" subtitle="Agrega un vehículo a tu inventario" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Link href="/dashboard/inventory">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Inventory
              </Button>
            </Link>
          </div>

          <GlassCard>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input id="year" type="number" placeholder="2024" min="1990" max="2025" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make *</Label>
                      <Select required>
                        <SelectTrigger id="make">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="honda">Honda</SelectItem>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="ford">Ford</SelectItem>
                          <SelectItem value="chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="nissan">Nissan</SelectItem>
                          <SelectItem value="hyundai">Hyundai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input id="model" placeholder="Civic" required />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="trim">Trim</Label>
                      <Input id="trim" placeholder="EX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color *</Label>
                      <Input id="color" placeholder="Silver" required />
                    </div>
                  </div>
                </div>

                {/* Identification */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Identification</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN *</Label>
                      <div className="flex gap-2">
                        <Input id="vin" placeholder="1HGBH41JXMN109186" required />
                        <Button type="button" variant="outline" size="icon">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Number *</Label>
                      <Input id="stock" placeholder="A12345" required />
                    </div>
                  </div>
                </div>

                {/* Pricing & Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Pricing & Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input id="price" type="number" placeholder="22000" min="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage *</Label>
                      <Input id="mileage" type="number" placeholder="32000" min="0" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="This well-maintained vehicle features..." rows={4} />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Photos</h3>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop photos here, or click to select</p>
                    <Button type="button" variant="outline" size="sm">
                      Select Photos
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Upload up to 10 photos (JPG, PNG)</p>
                  </div>
                </div>

                {/* Facebook Posting */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="facebook"
                      checked={postToFacebook}
                      onCheckedChange={(checked) => setPostToFacebook(checked as boolean)}
                    />
                    <Label htmlFor="facebook" className="text-sm font-normal cursor-pointer">
                      Publicar en Facebook Marketplace y página del concesionario
                    </Label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : postToFacebook ? "Guardar y Publicar en Facebook" : "Guardar Vehículo"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
