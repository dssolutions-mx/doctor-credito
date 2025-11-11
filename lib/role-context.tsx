"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./auth"

export type UserRole = "agent" | "dealer"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  user: User | null
  setUser: (user: User | null) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("agent")
  const [user, setUser] = useState<User | null>(null)

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole | null
    if (savedRole && (savedRole === "agent" || savedRole === "dealer")) {
      setRoleState(savedRole)
    }
  }, [])

  // Persist role to localStorage when it changes
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem("userRole", newRole)
  }

  return <RoleContext.Provider value={{ role, setRole, user, setUser }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

