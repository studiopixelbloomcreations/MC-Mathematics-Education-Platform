interface AppConfigJson {
  firebase?: {
    apiKey?: string
    authDomain?: string
    projectId?: string
    appId?: string
    messagingSenderId?: string
  }
  supabase?: {
    url?: string
    anonKey?: string
  }
}

function parseAppConfigJson(): AppConfigJson {
  const raw = import.meta.env.VITE_APP_CONFIG_JSON
  if (!raw) return {}

  try {
    return JSON.parse(raw) as AppConfigJson
  } catch {
    console.error('Invalid VITE_APP_CONFIG_JSON. Falling back to separate env vars.')
    return {}
  }
}

const parsed = parseAppConfigJson()

export const resolvedFirebaseConfig = {
  apiKey: parsed.firebase?.apiKey ?? import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: parsed.firebase?.authDomain ?? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: parsed.firebase?.projectId ?? import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: parsed.firebase?.appId ?? import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId:
    parsed.firebase?.messagingSenderId ?? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

export const resolvedSupabaseConfig = {
  url: parsed.supabase?.url ?? import.meta.env.VITE_SUPABASE_URL,
  anonKey: parsed.supabase?.anonKey ?? import.meta.env.VITE_SUPABASE_ANON_KEY,
}
