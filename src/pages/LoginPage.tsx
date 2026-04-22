import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AuthCard } from '../components/auth/AuthCard'
import { useAuth } from '../providers/auth-context'

export function LoginPage() {
  const navigate = useNavigate()
  const { firebaseUser, loginWithGoogle } = useAuth()

  useEffect(() => {
    if (firebaseUser) navigate('/userdashboard', { replace: true })
  }, [firebaseUser, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 md:px-6 lg:px-8">
      <AuthCard
        eyebrow="Login"
        title="Welcome back to MC Mathematics"
        description="Use Google Sign-In to access your student dashboard. Manual email and password login is visible for product completeness, but it is currently unavailable."
      >
        <div className="rounded-[1.8rem] border border-white/8 bg-slate-950/45 p-6">
          <button
            onClick={() => void loginWithGoogle()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300"
          >
            Continue with Google
            <ArrowRight size={18} />
          </button>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-sm text-slate-300">Email</span>
              <input
                disabled
                placeholder="Manual auth currently unavailable"
                className="w-full cursor-not-allowed rounded-2xl border border-white/8 bg-slate-950/55 px-4 py-3 text-slate-500 outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-3 block text-sm text-slate-300">Password</span>
              <input
                disabled
                type="password"
                placeholder="Use Google Sign-In"
                className="w-full cursor-not-allowed rounded-2xl border border-white/8 bg-slate-950/55 px-4 py-3 text-slate-500 outline-none"
              />
            </label>
          </div>
          <p className="mt-4 text-sm text-amber-200">Manual auth currently unavailable. Use Google Sign-In.</p>
          <p className="mt-6 text-sm text-slate-300">
            New student?{' '}
            <Link to="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Complete signup details
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  )
}
