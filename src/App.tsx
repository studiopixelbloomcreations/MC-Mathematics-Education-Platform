import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { AdminRoute } from './components/routes/AdminRoute'
import { LoadingScreen } from './components/shared/LoadingScreen'

const LandingPage = lazy(async () => ({
  default: (await import('./pages/LandingPage')).LandingPage,
}))
const UserDashboardPage = lazy(async () => ({
  default: (await import('./pages/UserDashboardPage')).UserDashboardPage,
}))
const AdminPanelPage = lazy(async () => ({
  default: (await import('./pages/AdminPanelPage')).AdminPanelPage,
}))

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingScreen message="Building the MC Mathematics experience..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/landingpage" replace />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminpanel"
            element={
              <AdminRoute>
                <AdminPanelPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/landingpage" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
