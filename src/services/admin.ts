import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types/auth'

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as UserProfile[]
}

export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole }) 
    .eq('id', userId)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  // Supabase silently returns successful (no error) but with 0 rows updated
  // if Row Level Security (RLS) blocks the update.
  if (!data || data.length === 0) {
    throw new Error('Database Update Blocked: Row Level Security (RLS) policies prevented this change. Ensure Admin update policies are correctly configured in Supabase.')
  }
}
