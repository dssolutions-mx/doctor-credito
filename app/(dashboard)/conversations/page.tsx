"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useConversations } from "@/hooks/use-supabase-data"
import { Phone, MessageSquare, CheckCircle, Clock, UserPlus } from "lucide-react"
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

export default function ConversationsPage() {
  const { conversations, loading } = useConversations(true, 'active') // with_phone=true, status=active
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConverting, setIsConverting] = useState(false)

  const handleConvertToLead = async (conversation: any) => {
    setIsConverting(true)
    try {
      const response = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create lead')
      }

      const data = await response.json()
      setIsDialogOpen(false)
      // Redirect to the new lead
      router.push(`/leads/${data.lead.id}`)
    } catch (error) {
      console.error('Error creating lead:', error)
      alert('Error al crear el lead. Por favor intenta de nuevo.')
    } finally {
      setIsConverting(false)
    }
  }

  const openConversionDialog = (conversation: any) => {
    setSelectedConversation(conversation)
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
        subtitle="Convierte conversaciones con teléfono capturado en leads"
      />

      <div className="flex-1 px-8 pt-10 pb-8 space-y-8 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Cargando conversaciones...</div>
        ) : !conversations || conversations.length === 0 ? (
          <GlassCard>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay conversaciones con teléfono capturado</h3>
              <p className="text-muted-foreground">
                Las conversaciones de N8N aparecerán aquí una vez que se capture el número de teléfono del cliente.
              </p>
            </CardContent>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => {
              const context = conversation.conversation_context?.[0]
              const messages = conversation.messages || []
              const lastMessage = messages[messages.length - 1]

              return (
                <GlassCard key={conversation.id} className="hover:shadow-lg transition-shadow">
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
                            <Phone className="h-4 w-4 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">
                              {conversation.phone_number}
                            </h3>
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
                        <Button
                          className="rounded-2xl"
                          onClick={() => openConversionDialog(conversation)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Crear Lead
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => {
                            // TODO: Show full conversation history in a modal
                            console.log('View conversation:', conversation.id)
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
      </div>

      {/* Conversion Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir Conversación a Lead</DialogTitle>
            <DialogDescription>
              Esto creará un nuevo lead con la información capturada de la conversación y generará automáticamente
              una tarea urgente para llamar al cliente.
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <p className="font-medium">{selectedConversation.phone_number}</p>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isConverting}>
              Cancelar
            </Button>
            <Button
              onClick={() => selectedConversation && handleConvertToLead(selectedConversation)}
              disabled={isConverting}
            >
              {isConverting ? 'Creando...' : 'Crear Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
