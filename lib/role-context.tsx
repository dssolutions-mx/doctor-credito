"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuthStore } from "./stores/auth-store"

export type UserRole = "agent" | "dealer" | "admin"

interface RoleContextType {
  role: UserRole
  user: { id: string; email: string; full_name: string | null; role: string | null } | null
  loading: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user: authUser, profile, loading, initialized } = useAuthStore()

  // Get role from profile, default to 'agent' if profile exists but role is null
  // If profile is null and we're initialized, user might not have profile yet
  const role: UserRole = profile?.role 
    ? (profile.role as UserRole) 
    : profile === null && initialized 
      ? "agent" // Default for users without profile
      : "agent" // Default while loading

  // Map auth user to role context user format
  const user = authUser && profile
    ? {
        id: authUser.id,
        email: profile.email || authUser.email || "",
        full_name: profile.full_name,
        role: profile.role,
      }
    : authUser && !profile && initialized
      ? {
          // User exists but profile doesn't - use auth user data
          id: authUser.id,
          email: authUser.email || "",
          full_name: null,
          role: null,
        }
      : null

  return (
    <RoleContext.Provider value={{ role, user, loading: loading || !initialized }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

