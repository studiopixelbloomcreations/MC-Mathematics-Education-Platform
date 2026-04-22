import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'
import type { UserProfile } from '../types/models'

export interface AuthContextValue {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  authBusy: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
