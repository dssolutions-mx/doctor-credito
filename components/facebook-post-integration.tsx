"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Facebook, ImageIcon, DollarSign } from "lucide-react"
import type { Vehicle } from "@/lib/types"

interface FacebookPostIntegrationProps {
  vehicle: Vehicle
}

export function FacebookPostIntegration({ vehicle }: FacebookPostIntegrationProps) {
  const [autoPost, setAutoPost] = useState(true)
  const [postText, setPostText] = useState(
    `🚗 Just In! ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}\n\n` +
      `💰 Special Price: $${vehicle.price.toLocaleString()}\n` +
      `📍 ${vehicle.color} | ${vehicle.mileage} miles\n` +
      `📦 Stock #${vehicle.stock}\n\n` +
      `Contact us today for a test drive! 🔥\n\n` +
      `#UsedCars #Miami #${vehicle.make} #CarDeals #AutoMaxMiami`,
  )
  const [includePrice, setIncludePrice] = useState(true)
  const [includeSpecs, setIncludeSpecs] = useState(true)

  const handlePost = () => {
    console.log("[v0] Posting to Facebook:", { vehicle, postText })
    // Handle Facebook posting
  }

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-[#1877F2]" />
          Facebook Marketplace Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-post to Facebook</Label>
            <p className="text-sm text-muted-foreground">Automatically post when adding to inventory</p>
          </div>
          <Switch checked={autoPost} onCheckedChange={setAutoPost} />
        </div>

        <div className="space-y-2">
          <Label>Post Content</Label>
          <Textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="price"
              checked={includePrice}
              onCheckedChange={(checked) => setIncludePrice(checked as boolean)}
            />
            <Label htmlFor="price" className="flex items-center gap-2 font-normal">
              <DollarSign className="h-4 w-4" />
              Include price in post
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="specs"
              checked={includeSpecs}
              onCheckedChange={(checked) => setIncludeSpecs(checked as boolean)}
            />
            <Label htmlFor="specs" className="flex items-center gap-2 font-normal">
              <ImageIcon className="h-4 w-4" />
              Include vehicle specifications
            </Label>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button onClick={handlePost} className="w-full gap-2">
            <Facebook className="h-4 w-4" />
            Post to Facebook Marketplace
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          By posting, you agree to Facebook's Commerce Policies and Terms of Service
        </div>
      </CardContent>
    </GlassCard>
  )
}
