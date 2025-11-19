"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/lib/role-context"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, profile, loading, initialized } = useAuthStore()

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push('/login')
      return
    }

    // Redirect dealers to their dashboard if they're on agent dashboard
    if (user && profile && profile.role === 'dealer') {
      const pathname = window.location.pathname
      if (pathname.startsWith('/dashboard') || pathname.startsWith('/leads') || pathname.startsWith('/tasks') || pathname.startsWith('/conversations')) {
        router.push('/dealer/dashboard')
      }
    }
  }, [user, profile, loading, initialized, router])

  // Show loading while checking auth
  if (!initialized || loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <RoleProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </RoleProvider>
  )
}

