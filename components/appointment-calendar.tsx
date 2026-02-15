"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, addWeeks, addMonths, startOfWeek, startOfMonth, endOfMonth, startOfDay, isSameDay, isSameMonth, isToday, eachHourOfInterval } from "date-fns"
import { es } from "date-fns/locale"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
  onEmptySlotClick?: (date: Date, hour: number) => void
}

const typeColors: Record<string, string> = {
  test_drive: "bg-primary border-primary",
  credit_approval: "bg-accent border-accent",
  delivery: "bg-success border-success",
  trade_in: "bg-warning border-warning",
  consultation: "bg-secondary border-secondary",
  showroom: "bg-secondary border-secondary",
}

const statusIndicators: Record<string, string> = {
  pending: "border-l-4",
  programada: "border-l-4",
  confirmada: "border-l-4",
  confirmed: "border-l-4",
  completed: "opacity-60",
  completada: "opacity-60",
  cancelled: "opacity-40 line-through",
  cancelada: "opacity-40 line-through",
  no_show: "opacity-40",
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

export function AppointmentCalendar({ appointments, onAppointmentClick, onEmptySlotClick }: AppointmentCalendarProps) {
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarDays = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i))

  const goToPrevious = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, -1))
    else if (view === "week") setCurrentDate(addWeeks(currentDate, -1))
    else setCurrentDate(addMonths(currentDate, -1))
  }

  const goToNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1))
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1))
    else setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (day: Date) => {
    setCurrentDate(day)
    setView("day")
  }

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    const slotStart = new Date(day)
    slotStart.setHours(hour, 0, 0, 0)
    const slotEnd = new Date(day)
    slotEnd.setHours(hour + 1, 0, 0, 0)
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      if (!isSameDay(aptDate, day)) return false
      const aptHour = aptDate.getHours()
      const aptEndHour = aptHour + Math.ceil((apt.duration || 60) / 60)
      return aptHour <= hour && aptEndHour > hour
    })
  }

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), day))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("day")}
          >
            Día
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Semana
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Mes
          </Button>
        </div>
        <h3 className="text-lg font-semibold">
          {view === "day" && format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          {view === "week" && `${format(weekDays[0], "MMM d", { locale: es })} - ${format(weekDays[6], "MMM d, yyyy", { locale: es })}`}
          {view === "month" && format(currentDate, "MMMM yyyy", { locale: es })}
        </h3>
      </div>

      {view === "day" && (
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {HOURS.map((hour) => {
              const slotAppointments = getAppointmentsForSlot(currentDate, hour)
              const hasAppointment = slotAppointments.length > 0
              return (
                <div
                  key={hour}
                  className={cn(
                    "grid grid-cols-1 gap-1 p-2 min-h-[60px] border-b last:border-b-0",
                    !hasAppointment && onEmptySlotClick && "cursor-pointer hover:bg-muted/50",
                  )}
                  onClick={() => {
                    if (!hasAppointment && onEmptySlotClick) {
                      onEmptySlotClick(new Date(currentDate), hour)
                    }
                  }}
                >
                  <div className="flex gap-2">
                    <div className="w-14 text-xs text-muted-foreground shrink-0 pt-1">
                      {hour === 12 ? "12:00 PM" : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                    </div>
                    <div className="flex-1 space-y-1">
                      {slotAppointments.map((apt) => (
                        <button
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAppointmentClick(apt)
                          }}
                          className={cn(
                            "w-full text-left p-2 rounded text-xs transition-all hover:shadow-md",
                            typeColors[apt.type] || typeColors.consultation,
                            statusIndicators[apt.status] || "",
                            "text-white",
                          )}
                        >
                          <div className="font-medium truncate">{apt.customerName}</div>
                          <div className="truncate opacity-90 text-[10px]">
                            {apt.type === "test_drive" ? "Prueba" : apt.type === "credit_approval" ? "Crédito" : apt.type === "delivery" ? "Entrega" : apt.type === "trade_in" ? "Avalúo" : "Consulta"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isTodayDate = isToday(day)
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[200px] rounded-lg border-2 p-3",
                  isTodayDate ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <div className="text-center mb-3 pb-2 border-b">
                  <div className="text-xs text-muted-foreground uppercase">{format(day, "EEE", { locale: es })}</div>
                  <div className={cn("text-2xl font-semibold mt-1", isTodayDate ? "text-primary" : "text-foreground")}>
                    {format(day, "d")}
                  </div>
                </div>
                <div className="space-y-2">
                  {dayAppointments.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => onAppointmentClick(apt)}
                      className={cn(
                        "w-full text-left p-2 rounded text-xs transition-all hover:shadow-md",
                        typeColors[apt.type] || typeColors.consultation,
                        statusIndicators[apt.status] || "",
                        "text-white",
                      )}
                    >
                      <div className="font-medium truncate">{format(new Date(apt.date), "h:mm a", { locale: es })}</div>
                      <div className="truncate opacity-90 mt-0.5">{apt.customerName}</div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === "month" && (
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 border-b bg-muted/30">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <div key={d} className="p-2 text-center text-sm font-medium">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day)
              const inMonth = isSameMonth(day, currentDate)
              const isTodayDate = isToday(day)
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[80px] p-2 border-b border-r cursor-pointer hover:bg-muted/30",
                    !inMonth && "bg-muted/20 text-muted-foreground",
                    isTodayDate && "bg-primary/10 ring-1 ring-primary",
                  )}
                >
                  <div className="text-sm font-medium">{format(day, "d")}</div>
                  {dayAppointments.length > 0 && (
                    <div className="mt-1 space-y-1">
                      <div className="text-[10px] font-medium text-primary">
                        {dayAppointments.length} {dayAppointments.length === 1 ? "cita" : "citas"}
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              typeColors[apt.type] || "bg-secondary",
                            )}
                            title={`${apt.customerName} - ${format(new Date(apt.date), "h:mm a")}`}
                          />
                        ))}
                        {dayAppointments.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{dayAppointments.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.test_drive}`} />
          <span>Prueba de Manejo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.credit_approval}`} />
          <span>Crédito</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.delivery}`} />
          <span>Entrega</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.trade_in}`} />
          <span>Trade-in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${typeColors.consultation}`} />
          <span>Consulta</span>
        </div>
      </div>
    </div>
  )
}
