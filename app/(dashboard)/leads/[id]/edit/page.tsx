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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLead, useVehicles } from "@/hooks/use-supabase-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type LeadWithExtras = {
  name?: string | null
  phone?: string | null
  occupation?: string | null
  city?: string | null
  state?: string | null
  source?: string | null
  status?: string | null
  urgency_level?: string | null
  vehicle_interest?: string | null
  vehicle_id?: string | null
  budget_range?: string | null
  credit_type?: string | null
  down_payment_amount?: number | null
  has_cosigner?: boolean | null
  notes?: string | null
  metadata?: {
    email?: string | null
    financing_type?: string
    trade_in?: {
      year?: string
      make?: string
      model?: string
      mileage?: string
      condition?: string
    } | null
  } | null
}

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { lead, loading: leadLoading, error } = useLead(id)
  const { vehicles, loading: vehiclesLoading } = useVehicles("available")
  const [loading, setLoading] = useState(false)
  const [openCombobox, setOpenCombobox] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    occupation: "",
    city: "",
    state: "",
    source: "",
    status: "",
    urgency_level: "",
    vehicle_interest: "",
    vehicle_id: "",
    budget_range: "",
    credit_type: "",
    down_payment_amount: "",
    has_cosigner: false,
    financing: "finance",
    notes: "",
    trade_in: false,
    trade_in_year: "",
    trade_in_make: "",
    trade_in_model: "",
    trade_in_mileage: "",
    trade_in_condition: "good",
  })

  useEffect(() => {
    if (lead) {
      const l = lead as LeadWithExtras
      const names = (l.name || "").trim().split(/\s+/)
      const firstName = names[0] ?? ""
      const lastName = names.slice(1).join(" ") ?? ""
      const meta = l.metadata as LeadWithExtras["metadata"] | undefined
      const ti = meta?.trade_in

      setFormData({
        firstName,
        lastName,
        email: meta?.email ?? "",
        phone: l.phone ?? "",
        occupation: l.occupation ?? "",
        city: l.city ?? "",
        state: l.state ?? "",
        source: l.source ?? "",
        status: l.status ?? "nuevo",
        urgency_level: l.urgency_level ?? "media",
        vehicle_interest: l.vehicle_interest ?? "",
        vehicle_id: l.vehicle_id ?? "",
        budget_range: l.budget_range ?? "",
        credit_type: l.credit_type ?? "",
        down_payment_amount: l.down_payment_amount != null ? String(l.down_payment_amount) : "",
        has_cosigner: l.has_cosigner ?? false,
        financing: meta?.financing_type ?? "finance",
        notes: l.notes ?? "",
        trade_in: !!ti,
        trade_in_year: ti?.year ?? "",
        trade_in_make: ti?.make ?? "",
        trade_in_model: ti?.model ?? "",
        trade_in_mileage: ti?.mileage ?? "",
        trade_in_condition: ti?.condition ?? "good",
      })
    }
  }, [lead])

  const handleVehicleSelect = (vehicleId: string) => {
    const selected = vehicles.find((v) => v.id === vehicleId)
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        vehicle_id: vehicleId,
        vehicle_interest: `${selected.year} ${selected.make} ${selected.model} - $${selected.price?.toLocaleString()}`,
      }))
      setOpenCombobox(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim()
      const payload = {
        name: name || "Lead sin nombre",
        phone: formData.phone,
        occupation: formData.occupation || null,
        city: formData.city || null,
        state: formData.state || null,
        source: formData.source,
        status: formData.status,
        urgency_level: formData.urgency_level,
        vehicle_interest: formData.vehicle_interest,
        vehicle_id: formData.vehicle_id || null,
        budget_range: formData.budget_range || null,
        credit_type: formData.credit_type || null,
        down_payment_amount: formData.down_payment_amount
          ? parseFloat(formData.down_payment_amount.replace(/[^0-9.-]/g, ""))
          : null,
        has_cosigner: formData.has_cosigner,
        notes: formData.notes,
        metadata: {
          email: formData.email || null,
          financing_type: formData.financing,
          trade_in: formData.trade_in
            ? {
                year: formData.trade_in_year,
                make: formData.trade_in_make,
                model: formData.trade_in_model,
                mileage: formData.trade_in_mileage,
                condition: formData.trade_in_condition,
              }
            : null,
        },
      }

      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update lead")
      }

      toast.success("Lead actualizado exitosamente")
      router.push(`/leads/${id}`)
    } catch (err) {
      console.error("Error updating lead:", err)
      toast.error("Error al actualizar el lead. Por favor intenta de nuevo.")
    } finally {
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
            <AlertDescription>{error || "Lead no encontrado"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Editar Lead" subtitle={formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : "Lead"} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
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
                <CardTitle>Información del Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Información Personal</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Juan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Pérez"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Ocupación</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="Ej: Mesero, Enfermera, Autónomo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Florida"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Miami"
                      />
                    </div>
                  </div>
                </div>

                {/* Crédito y Presupuesto */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Crédito y Presupuesto</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="credit_type">Crédito</Label>
                      <Select value={formData.credit_type} onValueChange={(v) => setFormData({ ...formData, credit_type: v })}>
                        <SelectTrigger id="credit_type">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="malo">Malo</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="first_time_buyer">First Time Buyer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Presupuesto</Label>
                      <Input
                        id="budget_range"
                        value={formData.budget_range}
                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                        placeholder="$20,000 - $25,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="down_payment">Enganche / Down Payment</Label>
                      <Input
                        id="down_payment"
                        type="text"
                        value={formData.down_payment_amount}
                        onChange={(e) => setFormData({ ...formData, down_payment_amount: e.target.value })}
                        placeholder="$5,000"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_cosigner"
                      checked={formData.has_cosigner}
                      onCheckedChange={(c) => setFormData({ ...formData, has_cosigner: c as boolean })}
                    />
                    <Label htmlFor="has_cosigner" className="cursor-pointer">Tiene co-signer</Label>
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label>Tipo de Compra</Label>
                    <RadioGroup
                      value={formData.financing}
                      onValueChange={(v) => setFormData({ ...formData, financing: v })}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="finance" id="finance" />
                        <Label htmlFor="finance">Financiamiento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Contado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lease" id="lease" />
                        <Label htmlFor="lease">Leasing</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Detalles del Lead */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Detalles del Lead</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="source">Fuente</Label>
                      <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
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
                      <Label htmlFor="status">Estado</Label>
                      <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Seleccionar estado" />
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
                      <Label htmlFor="urgency_level">Prioridad</Label>
                      <Select value={formData.urgency_level} onValueChange={(v) => setFormData({ ...formData, urgency_level: v })}>
                        <SelectTrigger id="urgency_level">
                          <SelectValue placeholder="Seleccionar prioridad" />
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

                  <div className="space-y-2 flex flex-col">
                    <Label className="mb-2">Vehículo de Interés</Label>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between">
                          {formData.vehicle_interest || "Seleccionar vehículo..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar vehículo..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron vehículos.</CommandEmpty>
                            <CommandGroup>
                              {(vehicles ?? []).map((vehicle) => (
                                <CommandItem key={vehicle.id} value={vehicle.id} onSelect={() => handleVehicleSelect(vehicle.id)}>
                                  <Check className={cn("mr-2 h-4 w-4", formData.vehicle_id === vehicle.id ? "opacity-100" : "opacity-0")} />
                                  {vehicle.year} {vehicle.make} {vehicle.model} - ${vehicle.price?.toLocaleString()}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {!formData.vehicle_id && (
                      <Input
                        placeholder="O escribe el interés manualmente..."
                        value={formData.vehicle_interest}
                        onChange={(e) => setFormData({ ...formData, vehicle_interest: e.target.value })}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>

                {/* Trade-in Section */}
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trade_in"
                      checked={formData.trade_in}
                      onCheckedChange={(c) => setFormData({ ...formData, trade_in: c as boolean })}
                    />
                    <Label htmlFor="trade_in" className="text-sm font-semibold text-foreground/70 uppercase tracking-wider cursor-pointer">
                      ¿Tiene vehículo para cambio (Trade-in)?
                    </Label>
                  </div>
                  {formData.trade_in && (
                    <div className="grid gap-4 md:grid-cols-3 bg-muted/20 p-4 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="trade_year">Año</Label>
                        <Input
                          id="trade_year"
                          placeholder="2018"
                          value={formData.trade_in_year}
                          onChange={(e) => setFormData({ ...formData, trade_in_year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trade_make">Marca</Label>
                        <Input
                          id="trade_make"
                          placeholder="Toyota"
                          value={formData.trade_in_make}
                          onChange={(e) => setFormData({ ...formData, trade_in_make: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trade_model">Modelo</Label>
                        <Input
                          id="trade_model"
                          placeholder="Corolla"
                          value={formData.trade_in_model}
                          onChange={(e) => setFormData({ ...formData, trade_in_model: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trade_mileage">Kilometraje</Label>
                        <Input
                          id="trade_mileage"
                          placeholder="45,000 mi"
                          value={formData.trade_in_mileage}
                          onChange={(e) => setFormData({ ...formData, trade_in_mileage: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="trade_condition">Condición</Label>
                        <Select value={formData.trade_in_condition} onValueChange={(v) => setFormData({ ...formData, trade_in_condition: v })}>
                          <SelectTrigger id="trade_condition">
                            <SelectValue placeholder="Seleccionar condición" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excelente</SelectItem>
                            <SelectItem value="good">Buena</SelectItem>
                            <SelectItem value="fair">Regular</SelectItem>
                            <SelectItem value="poor">Mala</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-6">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Agrega información adicional sobre el lead..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
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
