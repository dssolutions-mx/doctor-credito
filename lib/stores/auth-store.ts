'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string | null
  phone: string | null
  avatar_url: string | null
  is_active: boolean | null
}

interface AuthState {
  user: SupabaseUser | null
  profile: Profile | null
  session: any | null
  loading: boolean
  initialized: boolean
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ error?: string; user?: SupabaseUser }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error?: string; user?: SupabaseUser }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updatePassword: (newPassword: string) => Promise<{ error?: string }>
  refreshSession: () => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: SupabaseUser | null) => void
  setProfile: (profile: Profile | null) => void
  setSession: (session: any | null) => void
}

// Helper function to fetch profile via API route (avoids RLS issues)
const fetchProfileViaAPI = async (): Promise<Profile | null> => {
  try {
    const response = await fetch('/api/auth/profile', {
      cache: 'no-store',
    })

    if (!response.ok) {
      // If 401, user is not authenticated
      if (response.status === 401) {
        return null
      }
      // For other errors, log and return null
      const errorData = await response.json().catch(() => ({}))
      console.error('Error fetching profile:', errorData.error || response.statusText)
      return null
    }

    const data = await response.json()
    return data.profile || null
  } catch (error) {
    console.error('Error fetching profile via API:', error)
    return null
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ loading: false })
        return { error: error.message }
      }

      if (data.user && data.session) {
        // Fetch profile via API route to avoid RLS issues
        const profile = await fetchProfileViaAPI()

        set({
          user: data.user,
          session: data.session,
          profile: profile,
          loading: false,
        })

        return { user: data.user }
      }

      set({ loading: false })
      return { error: 'Failed to sign in' }
    } catch (error) {
      set({ loading: false })
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  signUp: async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      set({ loading: true })
      
      // Use API route for signup to handle profile creation server-side
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone: phone || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        set({ loading: false })
        return { error: errorData.error || 'Failed to sign up' }
      }

      const data = await response.json()

      if (data.user) {
        set({
          user: data.user,
          session: data.session,
          profile: data.profile || null,
          loading: false,
        })

        return { user: data.user }
      }

      set({ loading: false })
      return { error: 'Failed to sign up' }
    } catch (error) {
      set({ loading: false })
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })
      const supabase = createClient()
      
      await supabase.auth.signOut()
      
      set({
        user: null,
        profile: null,
        session: null,
        loading: false,
      })
    } catch (error) {
      console.error('Error signing out:', error)
      set({ loading: false })
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true })
      const supabase = createClient()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
      })

      set({ loading: false })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      set({ loading: false })
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      set({ loading: true })
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      set({ loading: false })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      set({ loading: false })
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  refreshSession: async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Error refreshing session:', error)
        set({ user: null, profile: null, session: null })
        return
      }

      if (data.user && data.session) {
        // Fetch profile via API route to avoid RLS issues
        const profile = await fetchProfileViaAPI()

        set({
          user: data.user,
          session: data.session,
          profile: profile,
        })
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      set({ user: null, profile: null, session: null })
    }
  },

  initialize: async () => {
    try {
      set({ loading: true })
      const supabase = createClient()

      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        set({ loading: false, initialized: true })
        return
      }

      if (session?.user) {
        // Fetch profile via API route to avoid RLS issues
        const profile = await fetchProfileViaAPI()

        set({
          user: session.user,
          session: session,
          profile: profile,
          loading: false,
          initialized: true,
        })

        // Set up auth state change listener
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            set({ user: null, profile: null, session: null })
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Fetch profile via API route to avoid RLS issues
            const profile = await fetchProfileViaAPI()

            set({
              user: session.user,
              session: session,
              profile: profile,
            })
          }
        })
      } else {
        set({ loading: false, initialized: true })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false, initialized: true })
    }
  },

  setUser: (user: SupabaseUser | null) => set({ user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  setSession: (session: any | null) => set({ session }),
}))

