import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingScreen } from '../shared/LoadingScreen'
import { useAuth } from '../../providers/auth-context'

export function AdminRoute({ children }: PropsWithChildren) {
  const { firebaseUser, loading, profile } = useAuth()

  if (loading) return <LoadingScreen message="Checking admin permissions..." />
  if (!firebaseUser) return <Navigate to="/landingpage" replace />
  if (profile?.role !== 'admin') return <Navigate to="/userdashboard" replace />

  return children
}
