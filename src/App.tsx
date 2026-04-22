import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { AdminRoute } from './components/routes/AdminRoute'
import { LoadingScreen } from './components/shared/LoadingScreen'

const LandingPage = lazy(async () => ({
  default: (await import('./pages/LandingPage')).LandingPage,
}))
const LoginPage = lazy(async () => ({
  default: (await import('./pages/LoginPage')).LoginPage,
}))
const SignupPage = lazy(async () => ({
  default: (await import('./pages/SignupPage')).SignupPage,
}))
const AdminLoginPage = lazy(async () => ({
  default: (await import('./pages/AdminLoginPage')).AdminLoginPage,
}))
const AdminSignupPage = lazy(async () => ({
  default: (await import('./pages/AdminSignupPage')).AdminSignupPage,
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/adminpanel/login" element={<AdminLoginPage />} />
          <Route path="/adminpanel/signup" element={<AdminSignupPage />} />
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
