// Authentication utilities and mock data

export type UserRole = "bdc_agent" | "dealer" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  dealership: string
  avatar?: string
}

// Mock user data - in production, this would come from a database
export const mockUsers: Record<string, User> = {
  "bdc@dealer.com": {
    id: "1",
    name: "Maria Rodriguez",
    email: "bdc@dealer.com",
    role: "bdc_agent",
    dealership: "AutoMax Miami",
  },
  "dealer@dealer.com": {
    id: "2",
    name: "John Smith",
    email: "dealer@dealer.com",
    role: "dealer",
    dealership: "AutoMax Miami",
  },
}

// Mock auth functions - replace with real auth in production
export async function getCurrentUser(): Promise<User | null> {
  // In production, check session/token
  // For now, return mock BDC agent
  return mockUsers["bdc@dealer.com"]
}

export async function signIn(email: string, password: string): Promise<User | null> {
  // Mock sign in - in production, verify credentials
  const user = mockUsers[email]
  if (user) {
    return user
  }
  return null
}

export async function signOut(): Promise<void> {
  // In production, clear session/token
  console.log("[v0] User signed out")
}
