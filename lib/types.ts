// Core data types for the CRM system

export type LeadSource = "facebook" | "website" | "phone" | "referral" | "walkin"
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment"
  | "negotiation"
  | "follow-up"
  | "closed"
  | "lost"
export type LeadPriority = "low" | "medium" | "high" | "urgent"

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: LeadSource
  status: LeadStatus
  priority: LeadPriority
  vehicleInterest: string
  budget: string
  notes: string
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  lastContact?: Date
  nextFollowUp?: Date
}

export interface Activity {
  id: string
  leadId: string
  type: "call" | "email" | "sms" | "note" | "appointment" | "status_change"
  description: string
  createdBy: string
  createdAt: Date
}

export interface Vehicle {
  id: string
  year: number
  make: string
  model: string
  trim?: string
  vin: string
  stock_number: string
  stock?: string // Legacy field for backward compatibility
  price: number
  mileage: number
  color?: string
  exterior_color?: string
  interior_color?: string
  status: "available" | "pending" | "sold"
  images?: string[]
  image_urls?: string[]
  primary_image_url?: string
  condition?: "new" | "used" | "certified"
  transmission?: string
  fuel_type?: string
  drivetrain?: string
  body_style?: string
  engine?: string
  features?: string[]
  description?: string
  marketing_title?: string
  sale_price?: number
  cost?: number
  facebook_posted?: boolean
  facebook_post_url?: string
}

export interface Appointment {
  id: string
  leadId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  vehicleInterest: string
  type: "test_drive" | "credit_approval" | "delivery" | "trade_in" | "consultation"
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  date: Date
  duration: number // in minutes
  assignedTo: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth?: Date
  driverLicense?: string
  creditScore?: number
  status: "active" | "inactive" | "potential"
  purchaseHistory: CustomerPurchase[]
  createdAt: Date
  updatedAt: Date
  tags: string[]
  notes: string
}

export interface CustomerPurchase {
  id: string
  vehicleId: string
  vehicleName: string
  purchaseDate: Date
  salePrice: number
  paymentMethod: "cash" | "finance" | "lease"
  downPayment: number
  monthlyPayment?: number
  tradeInValue?: number
}
