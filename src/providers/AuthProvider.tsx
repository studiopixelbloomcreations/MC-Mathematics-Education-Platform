import type { PropsWithChildren } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth, googleProvider, hasFirebaseConfig } from '../lib/firebase'
import { syncFirebaseUser } from '../lib/supabaseApi'
import type { UserProfile } from '../types/models'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(() => hasFirebaseConfig && Boolean(auth))

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const synced = await syncFirebaseUser(user)
        setProfile(synced)
      } catch {
        toast.error('Unable to sync profile with Supabase.')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!hasFirebaseConfig || !auth) {
      toast.error('Firebase configuration is missing. Add env values to enable auth.')
      return
    }

    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Signed in with Google')
    } catch {
      toast.error('Google sign-in failed. Please try again.')
    }
  }, [])

  const logout = useCallback(async () => {
    if (!auth) return
    await signOut(auth)
    toast.success('Logged out')
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return
    const nextProfile = await syncFirebaseUser(firebaseUser)
    setProfile(nextProfile)
  }, [firebaseUser])

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      loading,
      loginWithGoogle,
      logout,
      refreshProfile,
    }),
    [firebaseUser, profile, loading, loginWithGoogle, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
