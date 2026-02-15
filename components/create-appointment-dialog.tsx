"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Calendar as CalendarIcon, Clock, Search, Check, ChevronsUpDown } from "lucide-react"
import { useLeads, useVehicles } from "@/hooks/use-supabase-data"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CreateAppointmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    initialLeadId?: string
    initialDate?: string
    initialTime?: string
}

export function CreateAppointmentDialog({ open, onOpenChange, onSuccess, initialLeadId, initialDate, initialTime }: CreateAppointmentDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    
    // Form State
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [leadId, setLeadId] = useState("")
    const [vehicleId, setVehicleId] = useState("")
    const [type, setType] = useState("test_drive")
    const [notes, setNotes] = useState("")
    const [duration, setDuration] = useState("60")

    // Search State
    const [leadSearch, setLeadSearch] = useState("")
    const [debouncedLeadSearch, setDebouncedLeadSearch] = useState("")
    const [openLeadCombo, setOpenLeadCombo] = useState(false)
    const [openVehicleCombo, setOpenVehicleCombo] = useState(false)

    // Data Hooks
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedLeadSearch(leadSearch), 500)
        return () => clearTimeout(timer)
    }, [leadSearch])

    useEffect(() => {
        if (open) {
            if (initialLeadId) setLeadId(initialLeadId)
            if (initialDate) setDate(initialDate)
            if (initialTime) setTime(initialTime)
        }
    }, [open, initialLeadId, initialDate, initialTime])

    const { leads, loading: leadsLoading } = useLeads(undefined, debouncedLeadSearch)
    const { vehicles } = useVehicles("available")

    const handleSubmit = async () => {
        if (!date || !time || !leadId || !type) {
            toast.error("Por favor completa los campos requeridos")
            return
        }

        setIsLoading(true)
        try {
            // Combine date and time
            const scheduledAt = new Date(`${date}T${time}`)
            
            // Basic conflict check (optional, can be done via API)
            // For now rely on backend or just allow overlap with warning?
            // Let's just create it.

            const payload = {
                lead_id: leadId,
                scheduled_at: scheduledAt.toISOString(),
                duration_minutes: parseInt(duration),
                status: 'programada',
                appointment_type: type,
                notes: notes,
                // vehicle_interest is string in schema, but we can store vehicle ID in metadata if needed
                // or find vehicle name.
                vehicle_interest: vehicles.find(v => v.id === vehicleId)?.model || undefined, 
                metadata: {
                    vehicle_id: vehicleId
                }
            }

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) throw new Error("Failed to create appointment")
            
            toast.success("Cita programada exitosamente")
            onSuccess?.()
            onOpenChange(false)
            
            // Reset form
            setLeadId("")
            setVehicleId("")
            setNotes("")
            setDate("")
            setTime("")
        } catch (error) {
            console.error(error)
            toast.error("Error al programar la cita")
        } finally {
            setIsLoading(false)
        }
    }

    const selectedLead = leads.find(l => l.id === leadId)
    const selectedVehicle = vehicles.find(v => v.id === vehicleId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nueva Cita</DialogTitle>
                    <DialogDescription>
                        Programa una cita, prueba de manejo o visita.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Lead Selection */}
                    <div className="flex flex-col gap-2">
                        <Label>Lead / Cliente *</Label>
                        <Popover open={openLeadCombo} onOpenChange={setOpenLeadCombo}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openLeadCombo}
                                    className="justify-between"
                                >
                                    {selectedLead ? selectedLead.name : "Buscar cliente..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput 
                                        placeholder="Buscar por nombre o teléfono..." 
                                        value={leadSearch}
                                        onValueChange={setLeadSearch}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No se encontraron leads.</CommandEmpty>
                                        <CommandGroup>
                                            {leads.slice(0, 10).map((lead) => (
                                                <CommandItem
                                                    key={lead.id}
                                                    value={lead.id}
                                                    onSelect={(currentValue) => {
                                                        setLeadId(currentValue)
                                                        setOpenLeadCombo(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            leadId === lead.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{lead.name}</span>
                                                        <span className="text-xs text-muted-foreground">{lead.phone}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Type & Vehicle */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Tipo *</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="test_drive">Prueba de Manejo</SelectItem>
                                    <SelectItem value="consultation">Consulta / Asesoría</SelectItem>
                                    <SelectItem value="delivery">Entrega de Vehículo</SelectItem>
                                    <SelectItem value="trade_in">Avalúo (Trade-in)</SelectItem>
                                    <SelectItem value="credit_approval">Firma de Contrato</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Duración (min)</Label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 min</SelectItem>
                                    <SelectItem value="30">30 min</SelectItem>
                                    <SelectItem value="45">45 min</SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                    <SelectItem value="90">1.5 horas</SelectItem>
                                    <SelectItem value="120">2 horas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Vehículo (Opcional)</Label>
                         <Popover open={openVehicleCombo} onOpenChange={setOpenVehicleCombo}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openVehicleCombo}
                                    className="justify-between"
                                >
                                    {selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.model}` : "Seleccionar vehículo..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Buscar vehículo..." />
                                    <CommandList>
                                        <CommandEmpty>No se encontraron vehículos.</CommandEmpty>
                                        <CommandGroup>
                                            {vehicles.map((vehicle) => (
                                                <CommandItem
                                                    key={vehicle.id}
                                                    value={vehicle.id}
                                                    onSelect={(currentValue) => {
                                                        setVehicleId(currentValue)
                                                        setOpenVehicleCombo(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            vehicleId === vehicle.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Fecha *</Label>
                            <Input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Hora *</Label>
                            <Input 
                                type="time" 
                                value={time} 
                                onChange={(e) => setTime(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Notas</Label>
                        <Textarea 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            placeholder="Instrucciones especiales..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Programar Cita
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}



