"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Calendar, Clock, Car, User, CheckCircle2, X, AlertCircle } from "lucide-react"
import type { Appointment } from "@/lib/types"
import { format } from "date-fns"

interface AppointmentDetailDialogProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeLabels = {
  test_drive: "Test Drive",
  credit_approval: "Credit Approval",
  delivery: "Vehicle Delivery",
  trade_in: "Trade-in Evaluation",
  consultation: "Consultation",
}

const statusConfig = {
  pending: { label: "Pending", variant: "outline" as const, icon: Clock },
  confirmed: { label: "Confirmed", variant: "default" as const, icon: CheckCircle2 },
  completed: { label: "Completed", variant: "secondary" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "destructive" as const, icon: X },
  no_show: { label: "No Show", variant: "destructive" as const, icon: AlertCircle },
}

export function AppointmentDetailDialog({ appointment, open, onOpenChange }: AppointmentDetailDialogProps) {
  if (!appointment) return null

  const StatusIcon = statusConfig[appointment.status].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{typeLabels[appointment.type]}</DialogTitle>
              <DialogDescription className="mt-1">Appointment ID: {appointment.id}</DialogDescription>
            </div>
            <Badge variant={statusConfig[appointment.status].variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {statusConfig[appointment.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p className="text-base font-medium">{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </div>
              <p className="text-base font-medium">
                {format(new Date(appointment.date), "h:mm a")} ({appointment.duration} min)
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold text-foreground">Customer Information</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Name:</span>
                <span className="text-sm font-medium">{appointment.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Phone:</span>
                <a
                  href={`tel:${appointment.customerPhone}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {appointment.customerPhone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Email:</span>
                <a
                  href={`mailto:${appointment.customerEmail}`}
                  className="text-sm font-medium text-primary hover:underline truncate"
                >
                  {appointment.customerEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold text-foreground">Appointment Details</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Vehicle:</span>
                <span className="text-sm font-medium">{appointment.vehicleInterest}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">Assigned to:</span>
                <span className="text-sm font-medium">{appointment.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-semibold text-foreground">Notes</h4>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Customer
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            {appointment.status === "pending" && (
              <Button variant="outline" className="flex-1 bg-transparent">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
