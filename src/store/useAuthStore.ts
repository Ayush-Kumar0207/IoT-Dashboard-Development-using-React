import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types/auth'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

// Helper to safely fetch a user's profile
async function fetchProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      console.warn('Profile not found for user:', userId, error?.message)
      return null
    }
    return data as UserProfile
  } catch (err) {
    console.warn('Failed to fetch profile:', err)
    return null
  }
}

// Guard to prevent registering multiple auth listeners
let listenerRegistered = false

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  initialize: async () => {
    try {
      set({ isLoading: true })

      // Initial session check
      const { data: { session } } = await supabase.auth.getSession()
      const initialUser = session?.user ?? null
      const initialProfile = initialUser
        ? await fetchProfile(initialUser.id)
        : null

      set({ user: initialUser, profile: initialProfile, isLoading: false })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ user: null, profile: null, isLoading: false })
    }

    // Register the auth state listener only once
    if (!listenerRegistered) {
      listenerRegistered = true
      supabase.auth.onAuthStateChange(async (_event, session) => {
        const user = session?.user ?? null
        const profile = user ? await fetchProfile(user.id) : null
        set({ user, profile, isLoading: false })
      })
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, profile: null })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  },
}))
