"use client"

import type React from "react"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function LeadQualificationForm({ leadId }: { leadId: string }) {
  const [formData, setFormData] = useState({
    buyingTimeframe: "",
    creditSituation: "",
    hasTradeIn: false,
    tradeInDetails: "",
    financingNeeded: "",
    downPayment: "",
    employmentStatus: "",
    monthlyIncome: "",
    residencyStatus: "",
    specificNeeds: "",
    dealBreakers: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Qualification form submitted:", formData)
    // Handle form submission
  }

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle>Lead Qualification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Buying Timeframe */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">When are you looking to buy?</Label>
            <Select
              value={formData.buyingTimeframe}
              onValueChange={(value) => setFormData({ ...formData, buyingTimeframe: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediately (within 1 week)</SelectItem>
                <SelectItem value="soon">Soon (1-4 weeks)</SelectItem>
                <SelectItem value="month">Within a month</SelectItem>
                <SelectItem value="shopping">Just shopping around</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Credit Situation */}
          <div className="space-y-2">
            <Label>Credit Situation</Label>
            <RadioGroup
              value={formData.creditSituation}
              onValueChange={(value) => setFormData({ ...formData, creditSituation: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="font-normal">
                  Excellent (720+)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good" className="font-normal">
                  Good (680-719)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair" className="font-normal">
                  Fair (640-679)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor" className="font-normal">
                  Poor (below 640)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="unknown" />
                <Label htmlFor="unknown" className="font-normal">
                  Not sure
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Trade-In */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tradeIn"
                checked={formData.hasTradeIn}
                onCheckedChange={(checked) => setFormData({ ...formData, hasTradeIn: checked as boolean })}
              />
              <Label htmlFor="tradeIn" className="font-normal">
                Do you have a trade-in?
              </Label>
            </div>
            {formData.hasTradeIn && (
              <Textarea
                placeholder="Vehicle details (year, make, model, condition, mileage)..."
                value={formData.tradeInDetails}
                onChange={(e) => setFormData({ ...formData, tradeInDetails: e.target.value })}
                rows={2}
              />
            )}
          </div>

          {/* Financing */}
          <div className="space-y-2">
            <Label htmlFor="financing">Financing Needed?</Label>
            <Select
              value={formData.financingNeeded}
              onValueChange={(value) => setFormData({ ...formData, financingNeeded: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, need financing</SelectItem>
                <SelectItem value="preapproved">Pre-approved</SelectItem>
                <SelectItem value="cash">Cash purchase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Down Payment */}
          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment Amount</Label>
            <Input
              id="downPayment"
              type="text"
              placeholder="$5,000"
              value={formData.downPayment}
              onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
            />
          </div>

          {/* Employment */}
          <div className="space-y-2">
            <Label htmlFor="employment">Employment Status</Label>
            <Select
              value={formData.employmentStatus}
              onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full-time employed</SelectItem>
                <SelectItem value="parttime">Part-time employed</SelectItem>
                <SelectItem value="selfemployed">Self-employed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monthly Income */}
          <div className="space-y-2">
            <Label htmlFor="income">Approximate Monthly Income</Label>
            <Input
              id="income"
              type="text"
              placeholder="$4,000"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
            />
          </div>

          {/* Specific Needs */}
          <div className="space-y-2">
            <Label htmlFor="needs">Specific Needs or Requirements</Label>
            <Textarea
              id="needs"
              placeholder="Features, safety requirements, family size considerations..."
              value={formData.specificNeeds}
              onChange={(e) => setFormData({ ...formData, specificNeeds: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Qualification
          </Button>
        </form>
      </CardContent>
    </GlassCard>
  )
}
