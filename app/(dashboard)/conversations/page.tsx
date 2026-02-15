"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useConversations } from "@/hooks/use-supabase-data"
import { Phone, MessageSquare, CheckCircle, Clock, UserPlus, Sparkles, Search, AlertCircle, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { ConversationDetailDialog } from "@/components/conversation-detail-dialog"

type TabType = "with_phone" | "without_phone" | "all" | "processed"

export default function ConversationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("with_phone")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [viewingConversation, setViewingConversation] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Conversion Form State
  const [conversionData, setConversionData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  })
  const [duplicateError, setDuplicateError] = useState<{ id: string } | null>(null)

  // Fetch all conversations
  const { conversations: allConversations, loading, refetch } = useConversations(undefined, undefined)
  
  // Filter conversations based on tab and search
  const filteredConversations = useMemo(() => {
    if (!allConversations) return []
    
    let filtered = allConversations

    // Filter by tab
    switch (activeTab) {
      case "with_phone":
        filtered = filtered.filter(c => c.phone_number && !c.leads || c.leads?.length === 0)
        break
      case "without_phone":
        filtered = filtered.filter(c => !c.phone_number)
        break
      case "processed":
        filtered = filtered.filter(c => c.leads && c.leads.length > 0)
        break
      case "all":
      default:
        // Show all
        break
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(c => 
        c.phone_number?.toLowerCase().includes(search) ||
        c.conversation_context?.[0]?.vehicle_interest?.toLowerCase().includes(search) ||
        c.platform?.toLowerCase().includes(search)
      )
    }

    return filtered
  }, [allConversations, activeTab, searchTerm])

  const handleConvertToLead = async () => {
    setIsConverting(true)
    setDuplicateError(null)

    try {
      if (!conversionData.phone) {
        toast.error("Por favor ingresa un número de teléfono")
        setIsConverting(false)
        return
      }

      const context = selectedConversation?.conversation_context?.[0] || {}

      const creditMap: Record<string, string> = {
        bueno: 'bueno', good: 'bueno', excellent: 'bueno',
        regular: 'regular', fair: 'regular',
        malo: 'malo', poor: 'malo', bad: 'malo',
        first_time: 'first_time_buyer', firsttime: 'first_time_buyer',
      }
      const creditVal = context.credit_situation?.toLowerCase?.()
      const credit_type = creditVal ? creditMap[creditVal] || (creditVal.includes('first') ? 'first_time_buyer' : null) : null

      const downPaymentNum = context.down_payment_capacity ? parseFloat(String(context.down_payment_capacity).replace(/[^0-9.-]/g, '')) : NaN
      const down_payment_amount = !isNaN(downPaymentNum) ? downPaymentNum : null

      let city: string | null = null
      let state: string | null = null
      const loc = context.location
      if (typeof loc === 'string' && loc.includes(',')) {
        const parts = loc.split(',').map((p: string) => p.trim())
        if (parts.length >= 2) {
          city = parts[0] || null
          state = parts[1] || null
        }
      } else if (loc) {
        state = String(loc)
      }

      const payload = {
        conversation_id: selectedConversation.id,
        name: conversionData.name || "Lead sin nombre",
        phone: conversionData.phone,
        source: selectedConversation.platform || 'facebook',
        vehicle_interest: context.vehicle_interest,
        budget_range: context.budget_range,
        status: 'nuevo',
        urgency_level: selectedConversation.urgency || 'media',
        notes: conversionData.notes,
        credit_type,
        down_payment_amount,
        city,
        state,
        metadata: {
          email: conversionData.email,
          credit_situation: context.credit_situation,
        }
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
            setDuplicateError({ id: data.lead_id })
            toast.error("Este número de teléfono ya está registrado")
            setIsConverting(false)
            return
        }
        throw new Error(data.error || 'Failed to create lead')
      }

      setIsDialogOpen(false)
      setConversionData({ name: "", email: "", phone: "", notes: "" })
      toast.success("Lead creado exitosamente")
      
      // Refetch conversations
      refetch?.()
      
      // Redirect to the new lead
      router.push(`/leads/${data.lead.id}`)
    } catch (error) {
      console.error('Error creating lead:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear el lead. Por favor intenta de nuevo.')
    } finally {
      setIsConverting(false)
    }
  }

  const openConversionDialog = (conversation: any) => {
    setSelectedConversation(conversation)
    const context = conversation.conversation_context?.[0]
    setConversionData({
        name: "", // Can try to extract name from messages later if needed
        email: "",
        phone: conversation.phone_number || "",
        notes: context?.notes || ""
    })
    setDuplicateError(null)
    setIsDialogOpen(true)
  }

  const urgencyColors = {
    alta: "bg-destructive",
    media: "bg-warning",
    baja: "bg-muted",
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Conversaciones de N8N"
        subtitle="Gestiona y convierte conversaciones en leads"
      />

      <div className="flex-1 px-8 pt-6 pb-8 space-y-6 overflow-y-auto">
        {/* Search and Filters */}
        <GlassCard>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por teléfono, vehículo o plataforma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </CardContent>
        </GlassCard>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="with_phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Con Teléfono</span>
              <span className="sm:hidden">Teléfono</span>
              {filteredConversations.filter(c => c.phone_number && !c.leads?.length).length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                  {filteredConversations.filter(c => c.phone_number && !c.leads?.length).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="without_phone" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sin Teléfono</span>
              <span className="sm:hidden">Sin Tel.</span>
            </TabsTrigger>
            <TabsTrigger value="all">
              <span className="hidden sm:inline">Todos</span>
              <span className="sm:hidden">Todos</span>
            </TabsTrigger>
            <TabsTrigger value="processed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Procesadas</span>
              <span className="sm:hidden">Proc.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                Cargando conversaciones...
              </div>
            ) : filteredConversations.length === 0 ? (
              <GlassCard>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {activeTab === "with_phone" && "No hay conversaciones con teléfono"}
                    {activeTab === "without_phone" && "No hay conversaciones sin teléfono"}
                    {activeTab === "processed" && "No hay conversaciones procesadas"}
                    {activeTab === "all" && "No hay conversaciones"}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "with_phone" && "Las conversaciones con teléfono capturado aparecerán aquí."}
                    {activeTab === "without_phone" && "Las conversaciones sin teléfono aparecerán aquí. Puedes crear leads manualmente ingresando el teléfono."}
                    {activeTab === "processed" && "Las conversaciones que ya tienen leads asociados aparecerán aquí."}
                    {activeTab === "all" && "Las conversaciones de N8N aparecerán aquí."}
                  </p>
                </CardContent>
              </GlassCard>
            ) : (
              <div className="grid gap-4">
                {filteredConversations.map((conversation) => {
                  const context = conversation.conversation_context?.[0]
                  const messages = conversation.messages || []
                  const lastMessage = messages[messages.length - 1]
                  const hasExistingLead = conversation.leads && conversation.leads.length > 0

                  return (
                    <GlassCard 
                      key={conversation.id} 
                      className={`hover:shadow-lg transition-all ${hasExistingLead ? 'opacity-75' : ''}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Urgency Indicator */}
                          {conversation.urgency && urgencyColors[conversation.urgency as keyof typeof urgencyColors] && (
                            <div
                              className={`w-1 h-20 rounded-full ${urgencyColors[conversation.urgency as keyof typeof urgencyColors]} md:block hidden flex-shrink-0`}
                            />
                          )}

                          {/* Conversation Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                              <div className="flex items-center gap-2">
                                {conversation.phone_number ? (
                                  <Phone className="h-4 w-4 text-primary" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-warning" />
                                )}
                                <h3 className="text-lg font-semibold text-foreground">
                                  {conversation.phone_number || "Sin teléfono"}
                                </h3>
                                {hasExistingLead && (
                                  <Badge variant="outline" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Lead creado
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {conversation.status === 'active' ? (
                                  <Badge variant="default" className="capitalize">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Activa
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="capitalize">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Cerrada
                                  </Badge>
                                )}
                                {conversation.urgency && (
                                  <Badge variant="outline" className="capitalize">
                                    Urgencia: {conversation.urgency}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground capitalize">
                                  {conversation.platform || 'Facebook'}
                                </span>
                              </div>
                            </div>

                            {/* Conversation Context */}
                            {context && (
                              <div className="grid md:grid-cols-2 gap-2 text-sm">
                                {context.vehicle_interest && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Vehículo:</span>
                                    <span className="font-medium text-foreground">{context.vehicle_interest}</span>
                                  </div>
                                )}
                                {context.budget_range && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Presupuesto:</span>
                                    <span className="font-medium text-foreground">{context.budget_range}</span>
                                  </div>
                                )}
                                {context.credit_situation && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Crédito:</span>
                                    <span className="font-medium text-foreground capitalize">{context.credit_situation}</span>
                                  </div>
                                )}
                                {context.timeline && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Timeline:</span>
                                    <span className="font-medium text-foreground">{context.timeline}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Last Message */}
                            {lastMessage && (
                              <div className="bg-secondary/30 rounded-lg p-3">
                                <p className="text-sm text-muted-foreground mb-1">
                                  <span className="font-medium capitalize">{lastMessage.role}:</span>
                                </p>
                                <p className="text-sm text-foreground line-clamp-2">{lastMessage.content}</p>
                              </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{conversation.message_count || 0} mensajes</span>
                              <span>•</span>
                              <span>
                                {conversation.created_at
                                  ? formatDistanceToNow(new Date(conversation.created_at), {
                                      addSuffix: true,
                                      locale: es,
                                    })
                                  : 'Reciente'}
                              </span>
                              {conversation.phone_captured_at && (
                                <>
                                  <span>•</span>
                                  <span className="text-success">Teléfono capturado</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex md:flex-col gap-2 flex-shrink-0">
                            {!hasExistingLead ? (
                              <Button
                                className="rounded-2xl"
                                onClick={() => openConversionDialog(conversation)}
                                disabled={isConverting}
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Crear Lead
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="rounded-2xl"
                                onClick={() => {
                                  router.push(`/leads/${conversation.leads[0].id}`)
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Ver Lead
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="rounded-2xl"
                              onClick={() => {
                                setViewingConversation(conversation)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Ver Chat
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </GlassCard>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Conversion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Convertir Conversación a Lead</DialogTitle>
            <DialogDescription>
              Completa la información para crear el lead. Se generará una tarea urgente de seguimiento.
            </DialogDescription>
          </DialogHeader>

          {duplicateError && (
             <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Lead Duplicado</AlertTitle>
               <AlertDescription className="flex items-center gap-2 mt-2">
                 Este número ya existe.
                 <Button variant="outline" size="sm" onClick={() => router.push(`/leads/${duplicateError.id}`)}>
                    Ver Lead Existente
                 </Button>
               </AlertDescription>
             </Alert>
          )}

          {selectedConversation && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="conv-name">Nombre</Label>
                    <Input 
                        id="conv-name"
                        value={conversionData.name}
                        onChange={e => setConversionData({...conversionData, name: e.target.value})}
                        placeholder="Nombre completo"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="conv-email">Email</Label>
                    <Input 
                        id="conv-email"
                        type="email"
                        value={conversionData.email}
                        onChange={e => setConversionData({...conversionData, email: e.target.value})}
                        placeholder="email@ejemplo.com"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <Label htmlFor="conv-phone">Teléfono *</Label>
                 <Input 
                    id="conv-phone"
                    value={conversionData.phone}
                    onChange={e => setConversionData({...conversionData, phone: e.target.value})}
                    placeholder="+1 234 567 8900"
                    disabled={!!selectedConversation.phone_number} // Disable if came from system? Or allow edit? Better allow edit if needed, but maybe with warning. For now allow edit.
                    // Actually, if system has phone, it's safer to keep it, but maybe they typed it wrong.
                 />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="conv-notes">Notas (extraídas de conversación)</Label>
                 <Textarea 
                    id="conv-notes"
                    value={conversionData.notes}
                    onChange={e => setConversionData({...conversionData, notes: e.target.value})}
                    rows={4}
                 />
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Resumen del sistema:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="font-semibold">Vehículo:</span> {selectedConversation.conversation_context?.[0]?.vehicle_interest || 'N/A'}
                    </div>
                    <div>
                        <span className="font-semibold">Presupuesto:</span> {selectedConversation.conversation_context?.[0]?.budget_range || 'N/A'}
                    </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isConverting}>
              Cancelar
            </Button>
            <Button
              onClick={handleConvertToLead}
              disabled={isConverting || !conversionData.phone}
            >
              {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
              ) : 'Crear Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conversation Detail Dialog */}
      <ConversationDetailDialog
        conversation={viewingConversation}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  )
}
