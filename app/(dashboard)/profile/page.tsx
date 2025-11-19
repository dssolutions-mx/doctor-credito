"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Award, Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useRole } from "@/lib/role-context"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ProfilePage() {
  const { profile: authProfile, user: authUser, refreshSession } = useAuthStore()
  const { role } = useRole()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    leadsProcessed: 0,
    appointmentsSet: 0,
    dealsClosed: 0,
    conversionRate: 0,
  })
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  })

  useEffect(() => {
    if (authProfile) {
      const nameParts = authProfile.full_name?.split(" ") || []
      setFormData({
        full_name: authProfile.full_name || "",
        phone: authProfile.phone || "",
      })
      fetchStats()
    }
  }, [authProfile])

  const fetchStats = async () => {
    if (!authUser?.id) return
    
    try {
      setLoading(true)
      // Fetch user's leads count
      const leadsRes = await fetch("/api/leads")
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        const userLeads = leadsData.leads?.filter((lead: any) => lead.assigned_to === authUser.id) || []
        
        // Fetch appointments
        const appointmentsRes = await fetch("/api/appointments")
        const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : { appointments: [] }
        const userAppointments = appointmentsData.appointments?.filter((apt: any) => apt.assigned_to === authUser.id) || []
        
        // Calculate stats
        const closedLeads = userLeads.filter((lead: any) => lead.status === "cerrado" || lead.status === "vendido")
        const conversionRate = userLeads.length > 0 ? (closedLeads.length / userLeads.length) * 100 : 0

        setStats({
          leadsProcessed: userLeads.length,
          appointmentsSet: userAppointments.length,
          dealsClosed: closedLeads.length,
          conversionRate: Math.round(conversionRate * 10) / 10,
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      toast.success("Perfil actualizado exitosamente")
      setEditing(false)
      await refreshSession() // Refresh auth store to get updated profile
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Error al actualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const nameParts = authProfile?.full_name?.split(" ") || []
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || authProfile?.email?.[0]?.toUpperCase() || "U"
  
  const joinedDate = authUser?.created_at 
    ? format(new Date(authUser.created_at), "MMMM yyyy", { locale: es })
    : "N/A"

  if (!authProfile && !authUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Mi Perfil" subtitle="Administra tu información personal y visualiza tu rendimiento" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <GlassCard>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {authProfile?.full_name || authUser?.email || "Usuario"}
                    </h2>
                    <Badge variant="default" className="capitalize">
                      {role || "agent"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {authProfile?.email || authUser?.email || "N/A"}
                    </div>
                    {authProfile?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {authProfile.phone}
                      </div>
                    )}
                    {authUser?.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Se unió en {joinedDate}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    if (editing) {
                      setEditing(false)
                      // Reset form data
                      setFormData({
                        full_name: authProfile?.full_name || "",
                        phone: authProfile?.phone || "",
                      })
                    } else {
                      setEditing(true)
                    }
                  }} 
                  variant="outline" 
                  className="bg-transparent"
                  disabled={saving}
                >
                  {editing ? "Cancelar" : "Editar Perfil"}
                </Button>
              </div>
            </CardContent>
          </GlassCard>

          {/* Edit Form (conditional) */}
          {editing && (
            <GlassCard>
              <CardHeader>
                <CardTitle>Editar Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={authProfile?.email || authUser?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditing(false)
                      setFormData({
                        full_name: authProfile?.full_name || "",
                        phone: authProfile?.phone || "",
                      })
                    }} 
                    className="bg-transparent"
                    disabled={saving}
                  >
                    Cancelar
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
                <CardTitle>Rendimiento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.leadsProcessed}</div>
                    <div className="text-sm text-muted-foreground mb-1">Leads Procesados</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.appointmentsSet}</div>
                    <div className="text-sm text-muted-foreground mb-1">Citas Agendadas</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.dealsClosed}</div>
                    <div className="text-sm text-muted-foreground mb-1">Ventas Cerradas</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.conversionRate}%</div>
                    <div className="text-sm text-muted-foreground mb-1">Tasa de Conversión</div>
                  </div>
                </div>
              )}
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
