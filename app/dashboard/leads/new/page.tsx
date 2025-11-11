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
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewLeadPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to leads page
    router.push("/dashboard/leads")
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Crear Nuevo Lead" subtitle="Agregar un nuevo lead a tu pipeline" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a Leads
              </Button>
            </Link>
          </div>

          <GlassCard>
            <CardHeader>
              <CardTitle>Información del Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Información Personal</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input id="firstName" placeholder="Carlos" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input id="lastName" placeholder="Martinez" required />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="carlos@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Detalles del Lead</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="source">Fuente *</Label>
                      <Select required>
                        <SelectTrigger id="source">
                          <SelectValue placeholder="Seleccionar fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="website">Sitio Web</SelectItem>
                          <SelectItem value="phone">Teléfono</SelectItem>
                          <SelectItem value="referral">Referido</SelectItem>
                          <SelectItem value="walkin">Visita Directa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridad *</Label>
                      <Select required>
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleInterest">Vehículo de Interés</Label>
                    <Input id="vehicleInterest" placeholder="2024 Honda Civic" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Presupuesto</Label>
                    <Input id="budget" placeholder="$20,000 - $25,000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea id="notes" placeholder="Agrega información adicional sobre el lead..." rows={4} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear Lead"}
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
