"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { User, Bell, Palette, Building2, MessageSquare, Plus, Pencil, Trash2, Users, Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useRole } from "@/lib/role-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  name: string
  subject: string
  message: string
}

interface NotificationPreferences {
  newLeadNotifications: boolean
  appointmentReminders: boolean
  followUpReminders: boolean
  emailNotifications: boolean
  immediateEmailAlerts: boolean
  smsNotifications: boolean
}

interface DealershipData {
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { profile, refreshSession } = useAuthStore()
  const { role } = useRole()
  const isAdmin = role === "admin"

  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [savingPassword, setSavingPassword] = useState(false)

  // Notifications state
  const defaultNotifications: NotificationPreferences = {
    newLeadNotifications: true,
    appointmentReminders: true,
    followUpReminders: true,
    emailNotifications: false,
    immediateEmailAlerts: true,
    smsNotifications: true,
  }

  const defaultNotifications: NotificationPreferences = {
    newLeadNotifications: true,
    appointmentReminders: true,
    followUpReminders: true,
    emailNotifications: false,
    immediateEmailAlerts: true,
    smsNotifications: true,
  }

  const [notifications, setNotifications] = useState<NotificationPreferences>({ ...defaultNotifications })
  const [savingNotifications, setSavingNotifications] = useState(false)

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    message: "",
  })

  // Dealership state
  const [dealership, setDealership] = useState<DealershipData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  })
  const [savingDealership, setSavingDealership] = useState(false)

  // Load initial data
  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      })
      loadNotifications()
      loadTemplates()
      loadDealership()
    }
  }, [profile])

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/settings/notifications")
      if (res.ok) {
        const data = await res.json()
        const prefs = (data.preferences || {}) as Partial<NotificationPreferences>
        setNotifications({ ...defaultNotifications, ...prefs })
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true)
      const res = await fetch("/api/settings/templates")
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  const loadDealership = async () => {
    try {
      const res = await fetch("/api/settings/dealership")
      if (res.ok) {
        const data = await res.json()
        if (data.dealership) {
          setDealership(data.dealership)
        }
      }
    } catch (error) {
      console.error("Error loading dealership:", error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true)
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update profile")
      }

      toast.success("Perfil actualizado exitosamente")
      await refreshSession()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar perfil")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      setSavingPassword(true)
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: passwordData.newPassword }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update password")
      }

      toast.success("Contraseña actualizada exitosamente")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar contraseña")
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      setSavingNotifications(true)
      const res = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: notifications }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update notifications")
      }

      toast.success("Preferencias de notificaciones actualizadas")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar notificaciones")
    } finally {
      setSavingNotifications(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.message) {
      toast.error("Todos los campos son requeridos")
      return
    }

    try {
      if (editingTemplate) {
        const res = await fetch("/api/settings/templates", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTemplate.id, ...templateForm }),
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || "Failed to update template")
        }

        toast.success("Plantilla actualizada exitosamente")
      } else {
        const res = await fetch("/api/settings/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateForm),
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || "Failed to create template")
        }

        toast.success("Plantilla creada exitosamente")
      }

      setTemplateDialogOpen(false)
      setEditingTemplate(null)
      setTemplateForm({ name: "", subject: "", message: "" })
      loadTemplates()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar plantilla")
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta plantilla?")) return

    try {
      const res = await fetch(`/api/settings/templates?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to delete template")
      }

      toast.success("Plantilla eliminada exitosamente")
      loadTemplates()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar plantilla")
    }
  }

  const handleSaveDealership = async () => {
    try {
      setSavingDealership(true)
      const res = await fetch("/api/settings/dealership", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealership),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update dealership")
      }

      toast.success("Información del concesionario actualizada")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar concesionario")
    } finally {
      setSavingDealership(false)
    }
  }

  const openTemplateDialog = (template?: Template) => {
    if (template) {
      setEditingTemplate(template)
      setTemplateForm({
        name: template.name,
        subject: template.subject,
        message: template.message,
      })
    } else {
      setEditingTemplate(null)
      setTemplateForm({ name: "", subject: "", message: "" })
    }
    setTemplateDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Configuración" subtitle="Administra tu cuenta y preferencias" />

      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="dealership" className="gap-2">
              <Building2 className="h-4 w-4" />
              Concesionario
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Usuarios
              </TabsTrigger>
            )}
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Apariencia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <GlassCard>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Actualiza tu información personal y datos de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="mt-6">
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleUpdatePassword} disabled={savingPassword}>
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications">
            <GlassCard>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>Gestiona cómo recibes las notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones de Nuevos Leads</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones cuando se te asignen nuevos leads</p>
                  </div>
                  <Switch
                    checked={notifications.newLeadNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newLeadNotifications: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorios de Citas</Label>
                    <p className="text-sm text-muted-foreground">Recibe recordatorios 1 hora antes de las citas</p>
                  </div>
                  <Switch
                    checked={notifications.appointmentReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, appointmentReminders: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorios de Seguimiento</Label>
                    <p className="text-sm text-muted-foreground">Recibe recordatorios sobre seguimientos programados</p>
                  </div>
                  <Switch
                    checked={notifications.followUpReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, followUpReminders: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">Recibe resúmenes diarios por email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email de alerta inmediata</Label>
                    <p className="text-sm text-muted-foreground">Recibe emails al instante por nuevos leads, citas y tareas vencidas</p>
                  </div>
                  <Switch
                    checked={notifications.immediateEmailAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, immediateEmailAlerts: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por SMS</Label>
                    <p className="text-sm text-muted-foreground">Recibe actualizaciones urgentes por mensaje de texto</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={savingNotifications}>
                    {savingNotifications ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Preferencias"
                    )}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="templates">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Plantillas de Mensajes</h3>
                <p className="text-sm text-muted-foreground">Crea y gestiona plantillas de respuesta automática</p>
              </div>
              <Button onClick={() => openTemplateDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Plantilla
              </Button>
            </div>

            {loadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : templates.length === 0 ? (
              <GlassCard>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay plantillas</h3>
                  <p className="text-muted-foreground mb-4">Crea tu primera plantilla para comenzar</p>
                  <Button onClick={() => openTemplateDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Plantilla
                  </Button>
                </CardContent>
              </GlassCard>
            ) : (
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => openTemplateDialog(template)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent text-destructive"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded-lg bg-muted/50 text-sm text-foreground whitespace-pre-wrap font-mono">
                        {template.message}
                      </div>
                    </CardContent>
                  </GlassCard>
                ))}
              </div>
            )}

            <GlassCard className="mt-6">
              <CardHeader>
                <CardTitle>Variables Disponibles</CardTitle>
                <CardDescription>Usa estas variables en tus plantillas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{firstName}"}</code>
                    <p className="text-xs text-muted-foreground">Nombre del cliente</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{lastName}"}</code>
                    <p className="text-xs text-muted-foreground">Apellido del cliente</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{agentName}"}</code>
                    <p className="text-xs text-muted-foreground">Tu nombre</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{vehicleInterest}"}</code>
                    <p className="text-xs text-muted-foreground">Vehículo de interés del cliente</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{appointmentDate}"}</code>
                    <p className="text-xs text-muted-foreground">Fecha de la cita programada</p>
                  </div>
                  <div className="space-y-1">
                    <code className="text-sm font-mono text-primary">{"{appointmentTime}"}</code>
                    <p className="text-xs text-muted-foreground">Hora de la cita programada</p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="dealership">
            <GlassCard>
              <CardHeader>
                <CardTitle>Información del Concesionario</CardTitle>
                <CardDescription>Gestiona los detalles y marca de tu concesionario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="dealershipName">Nombre del Concesionario</Label>
                  <Input
                    id="dealershipName"
                    value={dealership.name}
                    onChange={(e) => setDealership({ ...dealership, name: e.target.value })}
                    placeholder="AutoMax Miami"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealershipAddress">Dirección</Label>
                  <Input
                    id="dealershipAddress"
                    value={dealership.address}
                    onChange={(e) => setDealership({ ...dealership, address: e.target.value })}
                    placeholder="123 Auto Boulevard"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={dealership.city}
                      onChange={(e) => setDealership({ ...dealership, city: e.target.value })}
                      placeholder="Miami"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={dealership.state}
                      onChange={(e) => setDealership({ ...dealership, state: e.target.value })}
                      placeholder="FL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Código Postal</Label>
                    <Input
                      id="zip"
                      value={dealership.zip}
                      onChange={(e) => setDealership({ ...dealership, zip: e.target.value })}
                      placeholder="33101"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealershipPhone">Teléfono</Label>
                  <Input
                    id="dealershipPhone"
                    type="tel"
                    value={dealership.phone}
                    onChange={(e) => setDealership({ ...dealership, phone: e.target.value })}
                    placeholder="(305) 555-0100"
                  />
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button onClick={handleSaveDealership} disabled={savingDealership}>
                    {savingDealership ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <GlassCard>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
                    <p className="text-muted-foreground">
                      Administra usuarios y permisos del sistema
                    </p>
                    <Button onClick={() => router.push("/settings/users")}>
                      Ir a Gestión de Usuarios
                    </Button>
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>
          )}

          <TabsContent value="appearance">
            <GlassCard>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>Personaliza la apariencia de tu dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Oscuro</Label>
                    <p className="text-sm text-muted-foreground">Cambia entre temas claro y oscuro</p>
                  </div>
                  <Switch disabled />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vista Compacta</Label>
                    <p className="text-sm text-muted-foreground">Usa un diseño más compacto para ver más información</p>
                  </div>
                  <Switch disabled />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <p className="text-sm text-muted-foreground mb-2">Elige tu idioma preferido</p>
                  <select className="w-full h-10 px-3 rounded-lg border bg-background" disabled>
                    <option>Español</option>
                    <option>English</option>
                  </select>
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Plantilla" : "Nueva Plantilla"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Actualiza la información de la plantilla"
                : "Crea una nueva plantilla de mensaje"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Nombre</Label>
              <Input
                id="templateName"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                placeholder="Contacto Inicial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateSubject">Asunto</Label>
              <Input
                id="templateSubject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                placeholder="¡Gracias por tu interés!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateMessage">Mensaje</Label>
              <Textarea
                id="templateMessage"
                value={templateForm.message}
                onChange={(e) => setTemplateForm({ ...templateForm, message: e.target.value })}
                placeholder="Hola {firstName},..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
