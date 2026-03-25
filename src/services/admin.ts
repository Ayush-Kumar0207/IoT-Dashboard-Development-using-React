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
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole }) 
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }
}
