"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MessageSquare, User, DollarSign, Car, Clock, Plus } from "lucide-react"
import type { Lead } from "@/lib/types"
import { LeadStatusBadge } from "./lead-status-badge"
import { format } from "date-fns"

interface LeadDetailSheetProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailSheet({ lead, open, onOpenChange }: LeadDetailSheetProps) {
  const [note, setNote] = useState("")

  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">
                {lead.firstName} {lead.lastName}
              </SheetTitle>
              <SheetDescription className="mt-1">
                Lead ID: {lead.id} • Created {format(lead.createdAt, "MMM d, yyyy")}
              </SheetDescription>
            </div>
            <LeadStatusBadge status={lead.status} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Lead Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Lead Details</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Source</Label>
                    <p className="text-sm font-medium mt-1 capitalize">{lead.source}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <p className="text-sm font-medium mt-1 capitalize">{lead.priority}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Vehicle Interest</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{lead.vehicleInterest}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Budget Range</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{lead.budget}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Assigned To</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{lead.assignedTo}</p>
                  </div>
                </div>

                {lead.nextFollowUp && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Next Follow-up</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{format(lead.nextFollowUp, "MMM d, yyyy h:mm a")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Update Status */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Update Status</Label>
              <Select defaultValue={lead.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Phone Call</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Initial contact call. Customer interested in financing options.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {lead.lastContact && format(lead.lastContact, "MMM d, yyyy h:mm a")} • Maria Rodriguez
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Lead Created</p>
                  <p className="text-xs text-muted-foreground mt-1">New lead from {lead.source}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(lead.createdAt, "MMM d, yyyy h:mm a")} • System
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-foreground">{lead.notes}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(lead.createdAt, "MMM d, yyyy")} • Maria Rodriguez
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label>Add Note</Label>
              <Textarea
                placeholder="Type your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
