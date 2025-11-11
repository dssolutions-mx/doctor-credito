"use client"

import { useState, useEffect, use } from "react"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, User, MapPin, Car } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ActiveCallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [notes, setNotes] = useState("")

  // Mock lead data
  const lead = {
    id: id,
    name: "Carlos Martinez",
    phone: "(305) 555-0123",
    vehicleInterest: "2024 Honda Civic",
    location: "Miami, FL",
    source: "Facebook",
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    // Navigate to call logging
    router.push(`/leads/${lead.id}?showCallModal=true`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Call Status */}
        <div className="text-center space-y-2">
          <Badge className="bg-success text-white animate-pulse">Call In Progress</Badge>
          <div className="text-4xl font-bold text-foreground">{formatDuration(callDuration)}</div>
        </div>

        {/* Caller Info */}
        <GlassCard>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{lead.name}</h2>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                    <Car className="h-4 w-4" />
                    Vehicle
                  </div>
                  <p className="text-xs font-medium text-foreground">{lead.vehicleInterest}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="text-xs font-medium text-foreground">{lead.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>

        {/* Quick Notes */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-sm">Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type notes during the call..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </CardContent>
        </GlassCard>

        {/* Call Controls */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            variant={isMuted ? "destructive" : "outline"}
            className="w-16 h-16 rounded-full bg-transparent"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button size="lg" variant="destructive" className="w-20 h-20 rounded-full" onClick={handleEndCall}>
            <PhoneOff className="h-8 w-8" />
          </Button>

          <Button
            size="lg"
            variant={isSpeakerOn ? "default" : "outline"}
            className="w-16 h-16 rounded-full bg-transparent"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
