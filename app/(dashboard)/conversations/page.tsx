"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useConversations } from "@/hooks/use-supabase-data"
import { Phone, MessageSquare, CheckCircle, Clock, UserPlus, Sparkles, Search, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [manualPhone, setManualPhone] = useState("")
  const [viewingConversation, setViewingConversation] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

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

  const handleConvertToLead = async (conversation: any, phoneOverride?: string) => {
    setIsConverting(true)
    try {
      // If conversation doesn't have phone and no override provided, show error
      if (!conversation.phone_number && !phoneOverride) {
        toast.error("Por favor ingresa un número de teléfono")
        setIsConverting(false)
        return
      }

      const response = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create lead')
      }

      const data = await response.json()
      setIsDialogOpen(false)
      setManualPhone("")
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
    setManualPhone(conversation.phone_number || "")
    setIsDialogOpen(true)
  }

  const urgencyColors = {
    alta: "bg-destructive",
    media: "bg-warning",
    baja: "bg-muted",
  }

  const hasPhone = selectedConversation?.phone_number
  const hasLead = selectedConversation?.leads && selectedConversation.leads.length > 0

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
                              <>
                                <Button
                                  className="rounded-2xl"
                                  onClick={() => openConversionDialog(conversation)}
                                  disabled={isConverting}
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  {conversation.phone_number ? "Crear Lead" : "Crear Lead"}
                                </Button>
                                {conversation.phone_number && (
                                  <Button
                                    variant="outline"
                                    className="rounded-2xl"
                                    onClick={() => {
                                      // Quick create - auto-create lead
                                      handleConvertToLead(conversation)
                                    }}
                                    disabled={isConverting}
                                  >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Crear Rápido
                                  </Button>
                                )}
                              </>
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

      {/* Conversion Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Convertir Conversación a Lead</DialogTitle>
            <DialogDescription>
              {hasPhone 
                ? "Esto creará un nuevo lead con la información capturada de la conversación y generará automáticamente una tarea urgente para llamar al cliente."
                : "Ingresa el número de teléfono para crear el lead. Se generará automáticamente una tarea urgente para contactar al cliente."}
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-4 py-4">
              {!hasPhone && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número de teléfono *</label>
                  <Input
                    placeholder="+1 234 567 8900"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    El teléfono es requerido para crear el lead
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <p className="font-medium">{hasPhone ? selectedConversation.phone_number : manualPhone || "No proporcionado"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Plataforma:</span>
                  <p className="font-medium capitalize">{selectedConversation.platform || 'Facebook'}</p>
                </div>
                {selectedConversation.conversation_context?.[0]?.vehicle_interest && (
                  <div>
                    <span className="text-muted-foreground">Vehículo de interés:</span>
                    <p className="font-medium">{selectedConversation.conversation_context[0].vehicle_interest}</p>
                  </div>
                )}
                {selectedConversation.urgency && (
                  <div>
                    <span className="text-muted-foreground">Urgencia:</span>
                    <p className="font-medium capitalize">{selectedConversation.urgency}</p>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Se creará automáticamente:</p>
                <ul className="text-sm space-y-1">
                  <li>✓ Lead con status "nuevo"</li>
                  <li>✓ Tarea urgente: "Llamar a nuevo lead" (vence en 5 minutos)</li>
                  <li>✓ Vinculación al historial de conversación</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false)
              setManualPhone("")
            }} disabled={isConverting}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedConversation) {
                  if (!hasPhone && !manualPhone) {
                    toast.error("Por favor ingresa un número de teléfono")
                    return
                  }
                  // If manual phone provided, update conversation first (or just use it in lead creation)
                  handleConvertToLead(selectedConversation, manualPhone || undefined)
                }
              }}
              disabled={isConverting || (!hasPhone && !manualPhone)}
            >
              {isConverting ? 'Creando...' : 'Crear Lead'}
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
