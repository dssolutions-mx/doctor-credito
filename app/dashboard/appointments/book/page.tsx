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
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export default function BookAppointmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to appointments page
    router.push("/dashboard/appointments")
  }

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Agendar Cita" subtitle="Programa una nueva cita" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a Citas
              </Button>
            </Link>
          </div>

          <GlassCard>
            <CardHeader>
              <CardTitle>Detalles de la Cita</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Customer Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="lead">Select Lead</Label>
                    <Select>
                      <SelectTrigger id="lead">
                        <SelectValue placeholder="Search or select a lead" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Carlos Martinez - 2024 Honda Civic</SelectItem>
                        <SelectItem value="2">Ana Gutierrez - 2023 Toyota Camry</SelectItem>
                        <SelectItem value="3">Juan Perez - 2024 Ford F-150</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input id="customerName" placeholder="Maria Lopez" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone *</Label>
                      <Input id="customerPhone" type="tel" placeholder="(555) 123-4567" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleInterest">Vehicle of Interest</Label>
                    <Input id="vehicleInterest" placeholder="2019 Honda Civic" />
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Detalles de la Cita</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Select required>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Cita *</Label>
                      <Select required>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="test_drive">Test Drive</SelectItem>
                          <SelectItem value="credit_approval">Credit Approval</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="trade_in">Trade-in Appraisal</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select defaultValue="60">
                        <SelectTrigger id="duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Add any special instructions or notes..." rows={3} />
                  </div>
                </div>

                {/* Confirmation */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Confirmation</h3>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">Automatic Confirmation</p>
                        <p className="text-xs text-muted-foreground">
                          SMS and email confirmations will be sent automatically to the customer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !date}>
                    {isSubmitting ? "Agendando..." : "Confirmar Cita"}
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
