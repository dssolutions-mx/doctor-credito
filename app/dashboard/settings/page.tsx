"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Palette, Building2, MessageSquare, Plus, Pencil, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const templates = [
    {
      id: "1",
      name: "Initial Contact",
      subject: "Thanks for your interest!",
      message:
        "Hi {firstName},\n\nThank you for reaching out to AutoMax Miami! I'm {agentName} and I'll be helping you find your perfect vehicle.\n\nI see you're interested in the {vehicleInterest}. Great choice! I'd love to discuss your needs and show you what we have available.\n\nWhen would be a good time for a quick call?\n\nBest regards,\n{agentName}\nAutoMax Miami",
    },
    {
      id: "2",
      name: "Appointment Confirmation",
      subject: "Your appointment is confirmed!",
      message:
        "Hi {firstName},\n\nYour appointment is confirmed for {appointmentDate} at {appointmentTime}.\n\nLocation: AutoMax Miami, 123 Auto Boulevard, Miami, FL 33101\n\nPlease bring:\n- Valid driver's license\n- Proof of insurance (for test drives)\n\nLooking forward to seeing you!\n\n{agentName}",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Configuración" subtitle="Administra tu cuenta y preferencias" />

      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="dealership" className="gap-2">
              <Building2 className="h-4 w-4" />
              Dealership
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <GlassCard>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Maria" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Rodriguez" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="maria.rodriguez@automax.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="(305) 555-0199" />
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="mt-6">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications">
            <GlassCard>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Lead Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new leads are assigned to you</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive reminders 1 hour before appointments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Follow-up Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded about scheduled follow-ups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summary emails</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive urgent updates via text message</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="templates">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Message Templates</h3>
                <p className="text-sm text-muted-foreground">Create and manage auto-response templates</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>

            <div className="space-y-4">
              {templates.map((template) => (
                <GlassCard key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>{template.subject}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-sm text-foreground whitespace-pre-wrap font-mono">
                        {template.message}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {"{firstName}"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {"{agentName}"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {"{vehicleInterest}"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="mt-6">
              <CardHeader>
                <CardTitle>Available Variables</CardTitle>
                <CardDescription>Use these variables in your templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{firstName}"}</code>
                    <p className="text-xs text-muted-foreground">Customer's first name</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{lastName}"}</code>
                    <p className="text-xs text-muted-foreground">Customer's last name</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{agentName}"}</code>
                    <p className="text-xs text-muted-foreground">Your name</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{vehicleInterest}"}</code>
                    <p className="text-xs text-muted-foreground">Vehicle customer is interested in</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{appointmentDate}"}</code>
                    <p className="text-xs text-muted-foreground">Scheduled appointment date</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{appointmentTime}"}</code>
                    <p className="text-xs text-muted-foreground">Scheduled appointment time</p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="dealership">
            <GlassCard>
              <CardHeader>
                <CardTitle>Dealership Information</CardTitle>
                <CardDescription>Manage your dealership details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="dealershipName">Dealership Name</Label>
                  <Input id="dealershipName" defaultValue="AutoMax Miami" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealershipAddress">Address</Label>
                  <Input id="dealershipAddress" defaultValue="123 Auto Boulevard" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Miami" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="FL" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="33101" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealershipPhone">Phone</Label>
                  <Input id="dealershipPhone" type="tel" defaultValue="(305) 555-0100" />
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="appearance">
            <GlassCard>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact View</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout to see more information</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground mb-2">Choose your preferred language</p>
                  <select className="w-full h-10 px-3 rounded-lg border bg-background">
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
