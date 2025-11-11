"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Customer } from "@/lib/types"
import { Mail, Phone, MapPin, Eye, CreditCard, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CustomerProfileCardProps {
  customer: Customer
  onViewDetails: (customer: Customer) => void
}

const statusConfig = {
  active: { label: "Active", variant: "default" as const },
  inactive: { label: "Inactive", variant: "secondary" as const },
  potential: { label: "Potential", variant: "outline" as const },
}

export function CustomerProfileCard({ customer, onViewDetails }: CustomerProfileCardProps) {
  const initials = `${customer.firstName[0]}${customer.lastName[0]}`
  const purchaseCount = customer.purchaseHistory.length
  const totalSpent = customer.purchaseHistory.reduce((sum, p) => sum + p.salePrice, 0)

  return (
    <Card className="hover:shadow-lg transition-all glass-card">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {customer.firstName} {customer.lastName}
              </h3>
              <Badge variant={statusConfig[customer.status].variant} className="text-xs">
                {statusConfig[customer.status].label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {customer.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                  {tag.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="truncate">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {customer.city}, {customer.state} {customer.zipCode}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Purchases</p>
              <p className="text-base font-semibold">{purchaseCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-base font-semibold">{totalSpent > 0 ? `$${(totalSpent / 1000).toFixed(0)}K` : "-"}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="outline" className="w-full bg-transparent" onClick={() => onViewDetails(customer)}>
          <Eye className="h-4 w-4 mr-2" />
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}
