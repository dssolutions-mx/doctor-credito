"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Customer } from "@/lib/types"
import { Phone, Mail, MapPin, CreditCard, Calendar, FileText, ShoppingCart, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"

interface CustomerDetailSheetProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig = {
  active: { label: "Active", variant: "default" as const },
  inactive: { label: "Inactive", variant: "secondary" as const },
  potential: { label: "Potential", variant: "outline" as const },
}

const paymentMethodLabels = {
  cash: "Cash",
  finance: "Financing",
  lease: "Lease",
}

export function CustomerDetailSheet({ customer, open, onOpenChange }: CustomerDetailSheetProps) {
  if (!customer) return null

  const initials = `${customer.firstName[0]}${customer.lastName[0]}`
  const totalSpent = customer.purchaseHistory.reduce((sum, p) => sum + p.salePrice, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <SheetTitle className="text-2xl">
                  {customer.firstName} {customer.lastName}
                </SheetTitle>
                <Badge variant={statusConfig[customer.status].variant}>{statusConfig[customer.status].label}</Badge>
              </div>
              <SheetDescription>Customer since {format(customer.createdAt, "MMM d, yyyy")}</SheetDescription>
              <div className="flex flex-wrap gap-1 mt-2">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize">
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground min-w-[80px]">Email:</span>
                  <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                    {customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground min-w-[80px]">Phone:</span>
                  <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                    {customer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground min-w-[80px]">Address:</span>
                  <span>
                    {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-foreground">Personal Details</h3>
              <div className="grid gap-3 text-sm">
                {customer.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[80px]">Birth Date:</span>
                    <span>{format(customer.dateOfBirth, "MMMM d, yyyy")}</span>
                  </div>
                )}
                {customer.driverLicense && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[80px]">License:</span>
                    <span className="font-mono text-xs">{customer.driverLicense}</span>
                  </div>
                )}
                {customer.creditScore && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[80px]">Credit Score:</span>
                    <span className="font-semibold">{customer.creditScore}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-foreground">Customer Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total Purchases</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{customer.purchaseHistory.length}</p>
                </div>
                <div className="p-4 rounded-lg bg-success/10">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="text-xs text-muted-foreground">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-success">${totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4 mt-6">
            {customer.purchaseHistory.length > 0 ? (
              <div className="space-y-4">
                {customer.purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{purchase.vehicleName}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(purchase.purchaseDate, "MMMM d, yyyy")}
                        </p>
                      </div>
                      <Badge variant="outline">{paymentMethodLabels[purchase.paymentMethod]}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sale Price:</span>
                        <p className="font-semibold text-primary">${purchase.salePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Down Payment:</span>
                        <p className="font-semibold">${purchase.downPayment.toLocaleString()}</p>
                      </div>
                      {purchase.monthlyPayment && (
                        <div>
                          <span className="text-muted-foreground">Monthly:</span>
                          <p className="font-semibold">${purchase.monthlyPayment}/mo</p>
                        </div>
                      )}
                      {purchase.tradeInValue && (
                        <div>
                          <span className="text-muted-foreground">Trade-in:</span>
                          <p className="font-semibold text-success">${purchase.tradeInValue.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No purchase history yet</p>
                <p className="text-sm text-muted-foreground mt-1">This customer is a potential buyer</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-foreground">{customer.notes}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {format(customer.updatedAt, "MMM d, yyyy")}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
