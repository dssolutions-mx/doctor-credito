"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Mail, Copy, Check } from "lucide-react"
import type { Vehicle } from "@/lib/types"

interface VehicleShareDialogProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehicleShareDialog({ vehicle, open, onOpenChange }: VehicleShareDialogProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(
    `Hi! I found this vehicle that might interest you:\n\n${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}\nPrice: $${vehicle.price.toLocaleString()}\nStock: ${vehicle.stock}\n\nLet me know if you'd like to schedule a test drive!`,
  )
  const [copied, setCopied] = useState(false)

  const shareLink = `https://automax-miami.com/inventory/${vehicle.id}`

  const handleSMS = () => {
    console.log("[v0] Sending SMS to:", phone)
    // Handle SMS sending
    onOpenChange(false)
  }

  const handleEmail = () => {
    console.log("[v0] Sending email to:", email)
    // Handle email sending
    onOpenChange(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Vehicle</DialogTitle>
          <DialogDescription>
            Share {vehicle.year} {vehicle.make} {vehicle.model} with your customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button size="icon" variant="outline" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* SMS */}
          <div className="space-y-2">
            <Label htmlFor="phone">Send via SMS</Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="(305) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSMS}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Send via Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
