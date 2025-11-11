"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

const typeColors = {
  test_drive: "bg-primary border-primary",
  credit_approval: "bg-accent border-accent",
  delivery: "bg-success border-success",
  trade_in: "bg-warning border-warning",
  consultation: "bg-secondary border-secondary",
}

const statusIndicators = {
  pending: "border-l-4",
  confirmed: "border-l-4",
  completed: "opacity-60",
  cancelled: "opacity-40 line-through",
  no_show: "opacity-40",
}

export function AppointmentCalendar({ appointments, onAppointmentClick }: AppointmentCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7))
  }

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <h3 className="text-lg font-semibold">
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </h3>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayAppointments = appointments.filter((apt) => isSameDay(new Date(apt.date), day))
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[200px] rounded-lg border-2 p-3",
                isToday ? "border-primary bg-primary/5" : "border-border bg-card",
              )}
            >
              {/* Day Header */}
              <div className="text-center mb-3 pb-2 border-b">
                <div className="text-xs text-muted-foreground uppercase">{format(day, "EEE")}</div>
                <div className={cn("text-2xl font-semibold mt-1", isToday ? "text-primary" : "text-foreground")}>
                  {format(day, "d")}
                </div>
              </div>

              {/* Appointments */}
              <div className="space-y-2">
                {dayAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className={cn(
                      "w-full text-left p-2 rounded text-xs transition-all hover:shadow-md",
                      typeColors[apt.type],
                      statusIndicators[apt.status],
                      "text-white",
                    )}
                  >
                    <div className="font-medium truncate">{format(new Date(apt.date), "h:mm a")}</div>
                    <div className="truncate opacity-90 mt-0.5">{apt.customerName}</div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.test_drive}`} />
          <span>Test Drive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.credit_approval}`} />
          <span>Credit Approval</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.delivery}`} />
          <span>Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.trade_in}`} />
          <span>Trade-in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.consultation}`} />
          <span>Consultation</span>
        </div>
      </div>
    </div>
  )
}
