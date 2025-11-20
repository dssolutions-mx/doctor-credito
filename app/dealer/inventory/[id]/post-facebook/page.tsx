"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useVehicle } from "@/hooks/use-supabase-data"
import { Loader2, Copy, Check, Facebook, ExternalLink, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function PostFacebookPage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string

  const { vehicle, loading: loadingVehicle, error: loadError } = useVehicle(vehicleId)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [facebookUrl, setFacebookUrl] = useState("")

  // Generate Facebook post text
  const generatePostText = () => {
    if (!vehicle) return ""

    const title = vehicle.marketing_title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    const price = vehicle.sale_price || vehicle.price
    const features = vehicle.features || []

    let post = `🚗 ${title}\n\n`
    post += `💰 Precio: $${price.toLocaleString()}\n`
    post += `📍 Kilometraje: ${vehicle.mileage.toLocaleString()} millas\n`

    if (vehicle.exterior_color) {
      post += `🎨 Color: ${vehicle.exterior_color}\n`
    }
    if (vehicle.transmission) {
      post += `⚙️ Transmisión: ${vehicle.transmission}\n`
    }

    if (features.length > 0) {
      post += `\n✨ Características:\n`
      features.slice(0, 5).forEach((feature: string) => {
        post += `• ${feature}\n`
      })
    }

    if (vehicle.description) {
      post += `\n${vehicle.description}\n`
    }

    post += `\n📞 ¡Contáctanos hoy mismo!\n`
    post += `📱 Llama o envía WhatsApp para más información\n`
    post += `\n#${vehicle.make} #${vehicle.model} #AutosUsados #CarrosEnVenta #Financing #BadCredit #NoCredit #Baltimore #Maryland`

    return post
  }

  const postText = generatePostText()

  const handleCopyText = () => {
    navigator.clipboard.writeText(postText)
    setCopied(true)
    toast.success("Texto copiado al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMarkAsPosted = async () => {
    if (!facebookUrl.trim()) {
      toast.error("Por favor ingresa la URL de la publicación de Facebook")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`/api/inventory/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facebook_posted: true,
          facebook_post_url: facebookUrl.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al marcar como publicado")
      }

      toast.success("Vehículo marcado como publicado en Facebook")
      router.push("/dealer/inventory")
    } catch (error) {
      console.error("Error marking as posted:", error)
      toast.error(error instanceof Error ? error.message : "Error al marcar como publicado")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loadingVehicle) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Publicar en Facebook" subtitle="Cargando..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando vehículo...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError || !vehicle) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Publicar en Facebook" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center">
          <GlassCard className="max-w-md">
            <CardContent className="py-12 text-center">
              <p className="text-destructive font-medium mb-2">Error al cargar vehículo</p>
              <p className="text-sm text-muted-foreground">{loadError || "Vehículo no encontrado"}</p>
              <Button className="mt-4" onClick={() => router.push("/dealer/inventory")}>
                Volver al Inventario
              </Button>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Publicar en Facebook"
        subtitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Already Posted Warning */}
          {vehicle.facebook_posted && (
            <GlassCard className="border-primary">
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Este vehículo ya fue publicado en Facebook</p>
                    {vehicle.facebook_post_url && (
                      <a
                        href={vehicle.facebook_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Ver publicación <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <Badge variant="secondary">Publicado</Badge>
                </div>
              </CardContent>
            </GlassCard>
          )}

          {/* Vehicle Preview */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Vista Previa del Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div>
                  {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
                    <div className="space-y-2">
                      <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={vehicle.image_urls[0]}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.image_urls.length} imagen(es) disponible(s)
                      </p>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    {vehicle.trim && <p className="text-muted-foreground">{vehicle.trim}</p>}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-bold text-primary text-lg">
                        ${(vehicle.sale_price || vehicle.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kilometraje:</span>
                      <span className="font-medium">{vehicle.mileage.toLocaleString()} millas</span>
                    </div>
                    {vehicle.exterior_color && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="font-medium">{vehicle.exterior_color}</span>
                      </div>
                    )}
                    {vehicle.transmission && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transmisión:</span>
                        <span className="font-medium">{vehicle.transmission}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="font-medium">{vehicle.stock_number}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Generated Post Text */}
          <GlassCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Texto para Facebook</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyText}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar Texto
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={postText}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
          </GlassCard>

          {/* Instructions */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Instrucciones para Publicar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Copia el texto de arriba</p>
                    <p className="text-sm text-muted-foreground">Usa el botón "Copiar Texto"</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Abre Facebook Marketplace</p>
                    <p className="text-sm text-muted-foreground">
                      Ve a{" "}
                      <a
                        href="https://www.facebook.com/marketplace/create/vehicle"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Facebook Marketplace - Crear Anuncio de Vehículo
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Completa el formulario de Facebook</p>
                    <p className="text-sm text-muted-foreground">
                      Pega el texto copiado en la descripción y sube las {vehicle.image_urls?.length || 0} imágenes
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Publica y copia la URL</p>
                    <p className="text-sm text-muted-foreground">
                      Después de publicar, copia la URL de tu publicación
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Pega la URL abajo y marca como publicado</p>
                    <p className="text-sm text-muted-foreground">
                      Esto te ayudará a rastrear qué vehículos ya están en Facebook
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Mark as Posted */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Marcar como Publicado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">URL de la Publicación de Facebook</Label>
                <Input
                  id="facebook_url"
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://www.facebook.com/marketplace/item/..."
                />
                <p className="text-xs text-muted-foreground">
                  Pega aquí la URL completa de tu publicación en Facebook Marketplace
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleMarkAsPosted}
                  disabled={loading || !facebookUrl.trim()}
                  className="flex-1 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Facebook className="h-4 w-4" />
                      Marcar como Publicado
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
