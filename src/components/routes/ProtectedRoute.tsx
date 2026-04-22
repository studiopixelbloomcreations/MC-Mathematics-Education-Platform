import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingScreen } from '../shared/LoadingScreen'
import { useAuth } from '../../providers/auth-context'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { firebaseUser, loading } = useAuth()

  if (loading) return <LoadingScreen message="Preparing your dashboard..." />
  if (!firebaseUser) return <Navigate to="/landingpage" replace />

  return children
}
