import { createClient } from '@supabase/supabase-js'
import { auth, hasFirebaseConfig } from './firebase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      accessToken: async () => {
        if (!hasFirebaseConfig || !auth?.currentUser) return null
        return auth.currentUser.getIdToken()
      },
    })
  : null
