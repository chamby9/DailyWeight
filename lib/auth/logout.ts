import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/database.types'

export const handleLogout = async (): Promise<{ error: Error | null }> => {
  try {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    return { error: null }
  } catch (error) {
    console.error('Logout error:', error)
    return { error: error instanceof Error ? error : new Error('Unknown error during logout') }
  }
}