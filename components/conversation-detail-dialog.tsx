"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, MessageSquare, Clock, User, Bot } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ConversationDetailDialogProps {
  conversation: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConversationDetailDialog({
  conversation,
  open,
  onOpenChange,
}: ConversationDetailDialogProps) {
  if (!conversation) return null

  // Extract conversation context (handle both array and single object)
  const context = Array.isArray(conversation.conversation_context) 
    ? conversation.conversation_context[0] 
    : conversation.conversation_context
  const messages = conversation.messages || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header - Fixed */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate">Historial de Conversación</DialogTitle>
              <DialogDescription className="mt-1 truncate">
                {conversation.phone_number || "Sin teléfono"} • {conversation.platform || "Facebook"}
              </DialogDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {conversation.status === 'active' ? (
                <Badge variant="default">Activa</Badge>
              ) : (
                <Badge variant="secondary">Cerrada</Badge>
              )}
              {conversation.urgency && (
                <Badge variant="outline" className="capitalize">
                  {conversation.urgency}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-4 space-y-4">
              {/* Conversation Context */}
              {context && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Contexto de la Conversación</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {context.vehicle_interest && (
                      <div className="min-w-0">
                        <span className="text-muted-foreground block mb-1">Vehículo de interés:</span>
                        <p className="font-medium break-words">{context.vehicle_interest}</p>
                      </div>
                    )}
                    {context.budget_range && (
                      <div className="min-w-0">
                        <span className="text-muted-foreground block mb-1">Presupuesto:</span>
                        <p className="font-medium break-words">{context.budget_range}</p>
                      </div>
                    )}
                    {context.credit_situation && (
                      <div className="min-w-0">
                        <span className="text-muted-foreground block mb-1">Situación de crédito:</span>
                        <p className="font-medium capitalize break-words">{context.credit_situation}</p>
                      </div>
                    )}
                    {context.timeline && (
                      <div className="min-w-0">
                        <span className="text-muted-foreground block mb-1">Timeline:</span>
                        <p className="font-medium break-words">{context.timeline}</p>
                      </div>
                    )}
                    {context.urgency_indicators && Array.isArray(context.urgency_indicators) && context.urgency_indicators.length > 0 && (
                      <div className="col-span-1 sm:col-span-2 min-w-0">
                        <span className="text-muted-foreground block mb-1">Indicadores de urgencia:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {context.urgency_indicators.map((indicator: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs break-words">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {context.concerns && Array.isArray(context.concerns) && context.concerns.length > 0 && (
                      <div className="col-span-1 sm:col-span-2 min-w-0">
                        <span className="text-muted-foreground block mb-1">Preocupaciones:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {context.concerns.map((concern: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs break-words">
                              {concern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {context.notes && (
                      <div className="col-span-1 sm:col-span-2 min-w-0">
                        <span className="text-muted-foreground block mb-1">Notas:</span>
                        <p className="font-medium break-words whitespace-pre-wrap">{context.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">
                    Mensajes ({messages.length})
                  </h3>
                </div>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No hay mensajes en esta conversación</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'flex-row' : 'flex-row-reverse'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`flex-1 min-w-0 rounded-lg p-3 max-w-[85%] ${
                            message.role === 'user'
                              ? 'bg-primary/10'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                            <span className="text-xs font-medium capitalize flex-shrink-0">
                              {message.role === 'user' ? 'Cliente' : 'Asistente'}
                            </span>
                            {message.created_at && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {format(new Date(message.created_at), "PPp", { locale: es })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground break-words whitespace-pre-wrap overflow-wrap-anywhere">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

        {/* Footer - Fixed */}
        <div className="border-t px-6 py-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{conversation.message_count || messages.length} mensajes</span>
            </div>
            {conversation.created_at && (
              <>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    Creada: {format(new Date(conversation.created_at), "PPp", { locale: es })}
                  </span>
                </div>
              </>
            )}
            {conversation.phone_captured_at && (
              <>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    Teléfono: {format(new Date(conversation.phone_captured_at), "PPp", { locale: es })}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

