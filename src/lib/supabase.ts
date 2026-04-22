import { createClient } from '@supabase/supabase-js'
import { auth, hasFirebaseConfig } from './firebase'
import { resolvedSupabaseConfig } from './appConfig'

const supabaseUrl = resolvedSupabaseConfig.url
const supabaseAnonKey = resolvedSupabaseConfig.anonKey

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
