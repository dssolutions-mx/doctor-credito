"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Award } from "lucide-react"

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria.rodriguez@automax.com",
    phone: "(555) 123-4567",
    role: "BDC Agent",
    dealership: "AutoMax Miami",
    joinedDate: "January 2024",
  })

  const stats = [
    { label: "Leads Processed", value: "145", change: "+12%" },
    { label: "Appointments Set", value: "42", change: "+8%" },
    { label: "Deals Closed", value: "18", change: "+15%" },
    { label: "Conversion Rate", value: "12.4%", change: "+2%" },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="My Profile" subtitle="Manage your personal information and view your performance" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <GlassCard>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <Badge variant="default">{profile.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{profile.dealership}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {profile.joinedDate}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setEditing(!editing)} variant="outline" className="bg-transparent">
                  {editing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </GlassCard>

          {/* Edit Form (conditional) */}
          {editing && (
            <GlassCard>
              <CardHeader>
                <CardTitle>Edit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setEditing(false)}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditing(false)} className="bg-transparent">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          )}

          {/* Performance Stats */}
          <GlassCard>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle>Performance This Month</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-success">{stat.change} vs last month</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
