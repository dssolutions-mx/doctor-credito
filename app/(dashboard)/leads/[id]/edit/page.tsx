"use client"

import type React from "react"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLead } from "@/hooks/use-supabase-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { lead, loading: leadLoading, error } = useLead(id)
  const [loading, setLoading] = useState(false)

  // Initialize form data from lead
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source: "",
    status: "",
    urgency_level: "",
    vehicle_interest: "",
    budget_range: "",
    notes: "",
  })

  // Update form data when lead loads
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        phone: lead.phone || "",
        source: lead.source || "",
        status: lead.status || "nuevo",
        urgency_level: lead.urgency_level || "media",
        vehicle_interest: lead.vehicle_interest || "",
        budget_range: lead.budget_range || "",
        notes: lead.notes || "",
      })
    }
  }, [lead])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update lead')
      }

      router.push(`/leads/${id}`)
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Error al actualizar el lead. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  if (leadLoading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Editar Lead" subtitle="Cargando..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Editar Lead" subtitle="Error al cargar lead" />
        <div className="flex-1 px-8 pt-10 pb-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Lead no encontrado'}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Editar Lead" subtitle={formData.name || "Lead"} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="mb-4">
            <Link href={`/leads/${id}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Lead
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <GlassCard>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) => setFormData({ ...formData, source: value })}
                    >
                      <SelectTrigger id="source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nuevo">Nuevo</SelectItem>
                        <SelectItem value="contactado">Contactado</SelectItem>
                        <SelectItem value="calificado">Calificado</SelectItem>
                        <SelectItem value="cita_programada">Cita Programada</SelectItem>
                        <SelectItem value="negociacion">Negociación</SelectItem>
                        <SelectItem value="cerrado">Cerrado</SelectItem>
                        <SelectItem value="perdido">Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency_level">Urgencia</Label>
                    <Select
                      value={formData.urgency_level}
                      onValueChange={(value) => setFormData({ ...formData, urgency_level: value })}
                    >
                      <SelectTrigger id="urgency_level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_interest">Interés en Vehículo</Label>
                  <Input
                    id="vehicle_interest"
                    value={formData.vehicle_interest}
                    onChange={(e) => setFormData({ ...formData, vehicle_interest: e.target.value })}
                    placeholder="e.g., 2019 Honda Civic"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_range">Rango de Presupuesto</Label>
                  <Input
                    id="budget_range"
                    value={formData.budget_range}
                    onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                    placeholder="e.g., $15,000 - $20,000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="Agregar notas adicionales sobre este lead..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Link href={`/leads/${id}`}>
                    <Button type="button" variant="outline" className="bg-transparent">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </GlassCard>
          </form>
        </div>
      </div>
    </div>
  )
}
