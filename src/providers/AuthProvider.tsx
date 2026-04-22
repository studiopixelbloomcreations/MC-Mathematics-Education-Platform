import type { PropsWithChildren } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth, googleProvider, hasFirebaseConfig } from '../lib/firebase'
import { ensureStudentId, saveUserProfile, syncFirebaseUser } from '../lib/supabaseApi'
import type { UserProfile } from '../types/models'
import { AuthContext } from './auth-context'

const SIGNUP_DRAFT_KEY = 'mc-signup-draft'

function describeAuthError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''

  switch (code) {
    case 'auth/popup-blocked':
    case 'auth/cancelled-popup-request':
      return 'Popup sign-in was blocked, so we are redirecting you to Google instead.'
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in popup was closed before completion.'
    case 'auth/unauthorized-domain':
      return `This domain is not authorized in Firebase yet. Add ${window.location.hostname} to Firebase Authentication > Settings > Authorized domains.`
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled in your Firebase Authentication settings.'
    case 'auth/network-request-failed':
      return 'The network request failed during Google sign-in. Check your internet connection and try again.'
    default:
      return 'Google sign-in failed. Please try again.'
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(() => hasFirebaseConfig && Boolean(auth))
  const [authBusy, setAuthBusy] = useState(false)

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) return

    void getRedirectResult(auth).catch((error) => {
      toast.error(describeAuthError(error))
      setAuthBusy(false)
    })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        let synced = await syncFirebaseUser(user)
        const draftRaw = localStorage.getItem(SIGNUP_DRAFT_KEY)

        if (draftRaw) {
          try {
            const draft = JSON.parse(draftRaw) as {
              full_name?: string
              grade?: string
              age?: string
              address?: string
              phone_number?: string
              whatsapp_number?: string
              enrollment_type?: 'theory' | 'paper' | 'both'
              sameAsPhone?: boolean
            }

            synced = await saveUserProfile(user.uid, {
              full_name: draft.full_name ?? user.displayName ?? synced.full_name,
              email: user.email ?? synced.email,
              grade: draft.grade ? Number(draft.grade) : synced.grade,
              age: draft.age ? Number(draft.age) : synced.age,
              address: draft.address ?? synced.address,
              phone_number: draft.phone_number ?? synced.phone_number,
              whatsapp_number: draft.sameAsPhone
                ? draft.phone_number ?? synced.phone_number
                : draft.whatsapp_number ?? synced.whatsapp_number,
              enrollment_type: draft.enrollment_type ?? synced.enrollment_type ?? 'both',
            })

            if (!synced.student_id && synced.grade && synced.enrollment_type) {
              const studentId = await ensureStudentId(user.uid, synced.grade, synced.enrollment_type)
              if (studentId) {
                synced = await saveUserProfile(user.uid, { student_id: studentId })
              }
            }

            localStorage.removeItem(SIGNUP_DRAFT_KEY)
          } catch {
            localStorage.removeItem(SIGNUP_DRAFT_KEY)
          }
        }

        setProfile(synced)
      } catch {
        toast.error('Unable to sync profile with Supabase.')
      } finally {
        setLoading(false)
        setAuthBusy(false)
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
      setAuthBusy(true)
      await signInWithPopup(auth, googleProvider)
      toast.success('Signed in with Google')
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''

      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
        toast(describeAuthError(error))
        await signInWithRedirect(auth, googleProvider)
        return
      }

      setAuthBusy(false)
      toast.error(describeAuthError(error))
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
      authBusy,
      loginWithGoogle,
      logout,
      refreshProfile,
    }),
    [firebaseUser, profile, loading, authBusy, loginWithGoogle, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
