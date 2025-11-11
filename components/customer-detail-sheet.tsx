"use client"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Customer } from "@/lib/types"
import { Phone, Mail, MapPin, CreditCard, Calendar, FileText, ShoppingCart, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CustomerDetailSheetProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig = {
  active: { label: "Activo", variant: "default" as const },
  inactive: { label: "Inactivo", variant: "secondary" as const },
  potential: { label: "Potencial", variant: "outline" as const },
}

const paymentMethodLabels = {
  cash: "Contado",
  finance: "Financiamiento",
  lease: "Leasing",
}

export function CustomerDetailSheet({ customer, open, onOpenChange }: CustomerDetailSheetProps) {
  if (!customer) return null

  const initials = `${customer.firstName[0]}${customer.lastName[0]}`
  const totalSpent = customer.purchaseHistory.reduce((sum, p) => sum + p.salePrice, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showHandle bodyClassName="flex flex-col gap-6 overflow-y-auto px-6 pb-8 pt-20">
        <SheetTitle className="sr-only">
          Perfil del Cliente: {customer.firstName} {customer.lastName}
        </SheetTitle>
        <div className="glass-section p-6 space-y-6">
          <div className="flex flex-wrap items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-black/8 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
              <AvatarFallback className="text-xl font-semibold text-foreground/90 dark:text-white/90">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[28px] leading-[36px] font-semibold text-foreground tracking-tight">
                  {customer.firstName} {customer.lastName}
                </h2>
                <Badge variant={statusConfig[customer.status].variant} className="rounded-full">{statusConfig[customer.status].label}</Badge>
              </div>
              <p className="text-[15px] leading-[20px] text-muted-foreground">
                Cliente desde {format(customer.createdAt, "PP", { locale: es })}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="glass-chip h-7 rounded-full px-3 text-[13px] font-medium capitalize">
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              size="lg"
              variant="ghost"
              className="glass-chip h-12 justify-center gap-2.5 text-[15px] font-semibold text-foreground hover:text-foreground"
            >
              <Phone className="h-5 w-5" />
              Llamar
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="glass-chip h-12 justify-center gap-2.5 text-[15px] font-semibold text-foreground hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
              Correo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="flex flex-col gap-4">
          <TabsList className="glass-control w-full">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="glass-section mt-2 p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[17px] leading-[24px] font-semibold text-foreground">Información de Contacto</h3>
                <div className="space-y-4 text-[15px] leading-[20px]">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-[90px] shrink-0">Email:</span>
                    <a href={`mailto:${customer.email}`} className="text-primary hover:underline truncate">
                      {customer.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-[90px] shrink-0">Teléfono:</span>
                    <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-[90px] shrink-0">Dirección:</span>
                    <span className="flex-1 min-w-0">
                      {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-black/6 dark:border-white/8">
                <h3 className="text-[17px] leading-[24px] font-semibold text-foreground">Datos Personales</h3>
                <div className="grid gap-4 text-[15px] leading-[20px]">
                  {customer.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground min-w-[135px] shrink-0">Fecha de Nacimiento:</span>
                      <span className="font-medium">{format(customer.dateOfBirth, "PP", { locale: es })}</span>
                    </div>
                  )}
                  {customer.driverLicense && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground min-w-[135px] shrink-0">Licencia:</span>
                      <span className="font-mono text-[13px] font-medium">{customer.driverLicense}</span>
                    </div>
                  )}
                  {customer.creditScore && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground min-w-[135px] shrink-0">Score Crediticio:</span>
                      <span className="font-semibold">{customer.creditScore}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5 pt-6 border-t border-black/6 dark:border-white/8">
                <h3 className="text-[17px] leading-[24px] font-semibold text-foreground">Estadísticas</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-primary/8 p-5 border border-primary/12">
                    <div className="flex items-center gap-2 text-[13px] leading-[18px] font-medium text-primary/80">
                      <ShoppingCart className="h-4 w-4" /> Compras Totales
                    </div>
                    <p className="text-[34px] leading-[44px] font-bold text-primary mt-2">{customer.purchaseHistory.length}</p>
                  </div>
                  <div className="rounded-2xl bg-success/8 p-5 border border-success/12">
                    <div className="flex items-center gap-2 text-[13px] leading-[18px] font-medium text-success/80">
                      <DollarSign className="h-4 w-4" /> Monto Total
                    </div>
                    <p className="text-[34px] leading-[44px] font-bold text-success mt-2">${totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="purchases">
            <div className="glass-section mt-2 p-6 space-y-5">
              {customer.purchaseHistory.length > 0 ? (
                <div className="space-y-4">
                  {customer.purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="rounded-2xl border border-black/6 bg-white/60 p-5 backdrop-blur shadow-sm dark:border-white/8 dark:bg-white/10">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h4 className="text-[17px] leading-[24px] font-semibold text-foreground">{purchase.vehicleName}</h4>
                          <p className="text-[13px] leading-[18px] text-muted-foreground mt-1">
                            {format(purchase.purchaseDate, "PP", { locale: es })}
                          </p>
                        </div>
                        <Badge variant="outline" className="glass-chip h-7 rounded-full px-3 text-[13px] font-medium">
                          {paymentMethodLabels[purchase.paymentMethod]}
                        </Badge>
                      </div>

                      <div className="grid gap-4 text-[15px] leading-[20px] sm:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground block mb-1">Precio de Venta:</span>
                          <p className="text-[17px] font-semibold text-primary">${purchase.salePrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1">Enganche:</span>
                          <p className="text-[17px] font-semibold">${purchase.downPayment.toLocaleString()}</p>
                        </div>
                        {purchase.monthlyPayment && (
                          <div>
                            <span className="text-muted-foreground block mb-1">Mensualidad:</span>
                            <p className="text-[17px] font-semibold">${purchase.monthlyPayment}/mes</p>
                          </div>
                        )}
                        {purchase.tradeInValue && (
                          <div>
                            <span className="text-muted-foreground block mb-1">Valor Trade-in:</span>
                            <p className="text-[17px] font-semibold text-success">${purchase.tradeInValue.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/8 bg-white/40 py-16 text-center backdrop-blur dark:border-white/8 dark:bg-white/5">
                  <ShoppingCart className="mx-auto mb-4 h-14 w-14 text-muted-foreground/60" />
                  <p className="text-[15px] leading-[20px] font-medium text-muted-foreground">Sin historial de compras</p>
                  <p className="text-[13px] leading-[18px] text-muted-foreground mt-1.5">Este cliente es un comprador potencial</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="glass-section mt-2 p-6 space-y-5">
              <div className="rounded-2xl bg-white/60 border border-black/6 p-5 backdrop-blur shadow-sm dark:border-white/8 dark:bg-white/10">
                <p className="text-[15px] leading-[24px] text-foreground">{customer.notes}</p>
                <p className="text-[13px] leading-[18px] text-muted-foreground mt-3">
                  Última actualización: {format(customer.updatedAt, "PP", { locale: es })}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
