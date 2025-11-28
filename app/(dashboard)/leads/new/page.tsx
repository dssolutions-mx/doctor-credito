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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useVehicles } from "@/hooks/use-supabase-data"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewLeadPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { vehicles, loading: vehiclesLoading } = useVehicles("available")
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    priority: "medium",
    vehicleInterest: "", // Text fallback or selected vehicle name
    vehicleId: "",
    budget: "",
    notes: "",
    financing: "finance", // cash, finance, lease
    tradeIn: false,
    tradeInYear: "",
    tradeInMake: "",
    tradeInModel: "",
    tradeInMileage: "",
    tradeInCondition: "good",
  })

  // Combobox State
  const [openCombobox, setOpenCombobox] = useState(false)
  const [duplicateError, setDuplicateError] = useState<{ id: string, assigned_to: string } | null>(null)

  const handleVehicleSelect = (vehicleId: string) => {
    const selected = vehicles.find((v) => v.id === vehicleId)
    if (selected) {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicleId,
        vehicleInterest: `${selected.year} ${selected.make} ${selected.model} - $${selected.price?.toLocaleString()}`
      }))
      setOpenCombobox(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setDuplicateError(null)

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        // Email stored in metadata as per schema limitations
        source: formData.source,
        urgency_level: formData.priority === 'urgent' ? 'urgent' : formData.priority === 'high' ? 'high' : 'medium',
        vehicle_interest: formData.vehicleInterest,
        budget_range: formData.budget,
        notes: formData.notes,
        metadata: {
            email: formData.email,
            vehicle_id: formData.vehicleId,
            financing_type: formData.financing,
            trade_in: formData.tradeIn ? {
                year: formData.tradeInYear,
                make: formData.tradeInMake,
                model: formData.tradeInModel,
                mileage: formData.tradeInMileage,
                condition: formData.tradeInCondition
            } : null
        }
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
            setDuplicateError({ id: data.lead_id, assigned_to: data.assigned_to })
            toast.error("Este número de teléfono ya está registrado.")
            return
        }
        throw new Error(data.error || "Error creando el lead")
      }

      toast.success("Lead creado exitosamente")
      router.push(`/leads/${data.lead.id}`)
    } catch (error) {
        console.error(error)
        toast.error("Ocurrió un error al crear el lead")
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Crear Nuevo Lead" subtitle="Agregar un nuevo lead a tu pipeline" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a Leads
              </Button>
            </Link>
          </div>

          {duplicateError && (
             <Alert variant="destructive" className="mb-6">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Lead Duplicado</AlertTitle>
               <AlertDescription className="flex items-center gap-2 mt-2">
                 Este número de teléfono ya existe en el sistema.
                 <Button variant="outline" size="sm" onClick={() => router.push(`/leads/${duplicateError.id}`)}>
                    Ver Lead Existente
                 </Button>
               </AlertDescription>
             </Alert>
          )}

          <GlassCard>
            <CardHeader>
              <CardTitle>Información del Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Información Personal</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        placeholder="Juan" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
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
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="juan@ejemplo.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Detalles del Lead</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="source">Fuente *</Label>
                      <Select required value={formData.source} onValueChange={v => setFormData({...formData, source: v})}>
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
                      <Select required value={formData.priority} onValueChange={v => setFormData({...formData, priority: v})}>
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

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="vehicleInterest" className="mb-2">Vehículo de Interés</Label>
                      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCombobox}
                            className="w-full justify-between"
                          >
                            {formData.vehicleInterest || "Seleccionar vehículo..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar vehículo..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron vehículos.</CommandEmpty>
                                <CommandGroup>
                                {vehicles.map((vehicle) => (
                                    <CommandItem
                                    key={vehicle.id}
                                    value={vehicle.id}
                                    onSelect={handleVehicleSelect}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.vehicleId === vehicle.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {vehicle.year} {vehicle.make} {vehicle.model} - ${vehicle.price?.toLocaleString()}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {!formData.vehicleId && (
                           <Input 
                                placeholder="O escribe el interés manualmente..." 
                                value={formData.vehicleInterest}
                                onChange={e => setFormData({...formData, vehicleInterest: e.target.value})}
                                className="mt-2"
                           />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Presupuesto</Label>
                      <Input 
                        id="budget" 
                        value={formData.budget}
                        onChange={e => setFormData({...formData, budget: e.target.value})}
                        placeholder="$20,000 - $25,000" 
                      />
                    </div>
                  </div>

                   {/* Financing */}
                   <div className="space-y-3 pt-2">
                        <Label>Tipo de Compra</Label>
                        <RadioGroup 
                            defaultValue="finance" 
                            value={formData.financing} 
                            onValueChange={v => setFormData({...formData, financing: v})}
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

                {/* Trade-in Section */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="tradeIn" 
                            checked={formData.tradeIn}
                            onCheckedChange={(checked) => setFormData({...formData, tradeIn: checked as boolean})}
                        />
                        <Label htmlFor="tradeIn" className="text-sm font-semibold text-foreground/70 uppercase tracking-wider cursor-pointer">
                            ¿Tiene vehículo para cambio (Trade-in)?
                        </Label>
                    </div>
                    
                    {formData.tradeIn && (
                        <div className="grid gap-4 md:grid-cols-3 bg-muted/20 p-4 rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="tradeYear">Año</Label>
                                <Input 
                                    id="tradeYear" 
                                    placeholder="2018"
                                    value={formData.tradeInYear}
                                    onChange={e => setFormData({...formData, tradeInYear: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tradeMake">Marca</Label>
                                <Input 
                                    id="tradeMake" 
                                    placeholder="Toyota"
                                    value={formData.tradeInMake}
                                    onChange={e => setFormData({...formData, tradeInMake: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tradeModel">Modelo</Label>
                                <Input 
                                    id="tradeModel" 
                                    placeholder="Corolla"
                                    value={formData.tradeInModel}
                                    onChange={e => setFormData({...formData, tradeInModel: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tradeMileage">Kilometraje</Label>
                                <Input 
                                    id="tradeMileage" 
                                    placeholder="45,000 mi"
                                    value={formData.tradeInMileage}
                                    onChange={e => setFormData({...formData, tradeInMileage: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="tradeCondition">Condición</Label>
                                <Select value={formData.tradeInCondition} onValueChange={v => setFormData({...formData, tradeInCondition: v})}>
                                    <SelectTrigger id="tradeCondition">
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
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        placeholder="Agrega información adicional sobre el lead..." 
                        rows={4} 
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando...
                        </>
                    ) : "Crear Lead"}
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
