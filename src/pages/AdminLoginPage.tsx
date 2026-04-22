import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { AuthCard } from '../components/auth/AuthCard'
import { useAuth } from '../providers/auth-context'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { firebaseUser, profile, loading, authBusy, loginWithGoogle, logout } = useAuth()

  useEffect(() => {
    if (loading) return

    if (firebaseUser && profile?.role === 'admin') {
      navigate('/adminpanel', { replace: true })
      return
    }

    if (firebaseUser && profile && profile.role !== 'admin') {
      toast.error('This Google account does not have admin access.')
      void logout()
    }
  }, [firebaseUser, profile, loading, logout, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 md:px-6 lg:px-8">
      <AuthCard
        eyebrow="Admin Login"
        title="Secure MC Mathematics admin access"
        description="This login is only for approved institute administrators. Student accounts cannot enter the admin panel from here."
      >
        <div className="rounded-[1.8rem] border border-white/8 bg-slate-950/45 p-6">
          <div className="mb-6 rounded-[1.5rem] border border-cyan-400/15 bg-cyan-400/10 p-4 text-sm leading-7 text-cyan-100">
            <div className="mb-3 flex items-center gap-3 text-base font-semibold text-white">
              <ShieldCheck size={18} />
              Admin-only route
            </div>
            Use the pre-approved Google account that has `role = admin` in Supabase. If the account is not marked as
            admin, access will be denied automatically.
          </div>

          <button
            onClick={() => void loginWithGoogle()}
            disabled={authBusy}
            className="glass-button inline-flex w-full items-center justify-center gap-2 px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
          >
            {authBusy ? 'Checking access...' : 'Continue with Google'}
            <ArrowRight size={18} />
          </button>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-sm text-slate-300">Admin Email</span>
              <input
                disabled
                placeholder="Manual admin auth unavailable"
                className="glass-input cursor-not-allowed px-4 py-3 text-slate-500"
              />
            </label>
            <label className="block">
              <span className="mb-3 block text-sm text-slate-300">Password</span>
              <input
                disabled
                type="password"
                placeholder="Use Google Sign-In"
                className="glass-input cursor-not-allowed px-4 py-3 text-slate-500"
              />
            </label>
          </div>

          <p className="mt-4 text-sm text-amber-200">
            Manual auth currently unavailable. Use the approved admin Google account.
          </p>
          <p className="mt-6 text-sm text-slate-300">
            Need a new admin account?{' '}
            <Link to="/adminpanel/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Request admin setup
            </Link>
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Student login stays at{' '}
            <Link to="/login" className="font-semibold text-slate-200 hover:text-white">
              /login
            </Link>
            .
          </p>
        </div>
      </AuthCard>
    </div>
  )
}
