"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useRole } from "@/lib/role-context"
import { Users, Plus, Edit, Trash2, Shield, User, Building2, Search } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string | null
  phone: string | null
  is_active: boolean | null
  created_at: string | null
}

export default function UsersPage() {
  const { profile: currentProfile } = useAuthStore()
  const { role } = useRole()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "agent" as "agent" | "dealer" | "admin",
    is_active: true,
  })

  const isAdmin = role === "admin" || currentProfile?.role === "admin"

  useEffect(() => {
    if (!isAdmin) {
      toast.error("No tienes permisos para acceder a esta página")
      return
    }
    fetchUsers()
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: 'TempPassword123!', // Should be changed on first login
          fullName: formData.full_name,
          phone: formData.phone || null,
          role: formData.role,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create user')
      }

      toast.success("Usuario creado exitosamente")
      setIsDialogOpen(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(error instanceof Error ? error.message : "Error al crear usuario")
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
          role: formData.role,
          is_active: formData.is_active,
        })
        .eq('id', editingUser.id)

      if (error) throw error

      toast.success("Usuario actualizado exitosamente")
      setIsDialogOpen(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error("Error al actualizar usuario")
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de desactivar este usuario?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId)

      if (error) throw error

      toast.success("Usuario desactivado")
      fetchUsers()
    } catch (error) {
      console.error('Error deactivating user:', error)
      toast.error("Error al desactivar usuario")
    }
  }

  const openCreateDialog = () => {
    setEditingUser(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      full_name: user.full_name || "",
      phone: user.phone || "",
      role: (user.role as "agent" | "dealer" | "admin") || "agent",
      is_active: user.is_active ?? true,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      email: "",
      full_name: "",
      phone: "",
      role: "agent",
      is_active: true,
    })
    setEditingUser(null)
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const roleIcons = {
    admin: Shield,
    dealer: Building2,
    agent: User,
  }

  const roleColors = {
    admin: "bg-destructive",
    dealer: "bg-primary",
    agent: "bg-secondary",
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Acceso denegado</h3>
          <p className="text-muted-foreground">Solo los administradores pueden acceder a esta página</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Gestión de Usuarios"
        subtitle="Administra usuarios y permisos del sistema"
      />

      <div className="flex-1 px-8 pt-6 pb-8 space-y-6 overflow-y-auto">
        {/* Search and Create */}
        <GlassCard>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Button onClick={openCreateDialog} className="h-10">
                <Plus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            Cargando usuarios...
          </div>
        ) : filteredUsers.length === 0 ? (
          <GlassCard>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay usuarios</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron usuarios con ese criterio" : "Crea el primer usuario para comenzar"}
              </p>
            </CardContent>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => {
              const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User
              const roleColor = roleColors[user.role as keyof typeof roleColors] || "bg-secondary"

              return (
                <GlassCard key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-2xl ${roleColor} text-primary-foreground`}>
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {user.full_name || "Sin nombre"}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {user.role || "agent"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.id !== currentProfile?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              )
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuario" : "Crear Usuario"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Actualiza la información del usuario"
                : "Crea un nuevo usuario en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo *</Label>
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as "agent" | "dealer" | "admin" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agente</SelectItem>
                  <SelectItem value="dealer">Concesionario (Solo admins)</SelectItem>
                  <SelectItem value="admin">Administrador (Solo admins)</SelectItem>
                </SelectContent>
              </Select>
              {(formData.role === 'dealer' || formData.role === 'admin') && !editingUser && (
                <p className="text-xs text-muted-foreground">
                  Solo los administradores pueden crear cuentas de concesionario o administrador.
                </p>
              )}
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="is_active">Estado</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) => setFormData({ ...formData, is_active: value === "active" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
              {editingUser ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

