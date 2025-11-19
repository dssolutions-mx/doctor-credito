'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useRouter, usePathname } from 'next/navigation'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, user, loading, initialized } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  // Protect routes that require authentication
  useEffect(() => {
    if (!initialized || loading) return

    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))

    // Don't redirect on public routes
    if (isPublicRoute || pathname === '/') {
      return
    }

    if (!user) {
      router.push('/login')
    } else if (pathname === '/login' || pathname === '/register') {
      router.push('/dashboard')
    }
  }, [user, loading, initialized, pathname, router])

  // Show loading state only on protected routes while initializing
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))
  
  if (!initialized && !isPublicRoute && pathname !== '/') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}

