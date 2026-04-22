import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { AuthCard } from '../components/auth/AuthCard'
import { useAuth } from '../providers/auth-context'

export function AdminSignupPage() {
  const navigate = useNavigate()
  const { firebaseUser, profile, loading, authBusy, loginWithGoogle, logout } = useAuth()

  useEffect(() => {
    if (loading) return

    if (firebaseUser && profile?.role === 'admin') {
      navigate('/adminpanel', { replace: true })
      return
    }

    if (firebaseUser && profile && profile.role !== 'admin') {
      toast.error('That account is not approved for admin signup.')
      void logout()
    }
  }, [firebaseUser, profile, loading, logout, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 md:px-6 lg:px-8">
      <AuthCard
        eyebrow="Admin Signup"
        title="Provision a separate administrator access point"
        description="Share this page only with staff members. It validates Google sign-in and only allows pre-approved admin accounts into the admin panel."
      >
        <div className="rounded-[1.8rem] border border-white/8 bg-slate-950/45 p-6">
          <div className="mb-6 rounded-[1.5rem] border border-fuchsia-400/15 bg-fuchsia-400/10 p-4 text-sm leading-7 text-fuchsia-100">
            <div className="mb-3 flex items-center gap-3 text-base font-semibold text-white">
              <LockKeyhole size={18} />
              Invite-only admin access
            </div>
            Normal students should not use this page. Before this works, make sure the Google account already exists in
            Supabase and has `role = admin`.
          </div>

          <button
            onClick={() => void loginWithGoogle()}
            disabled={authBusy}
            className="glass-button inline-flex w-full items-center justify-center gap-2 px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
          >
            {authBusy ? 'Verifying admin account...' : 'Continue with Google'}
            <ArrowRight size={18} />
          </button>

          <div className="mt-6 space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 text-sm text-slate-300">
            <p className="font-semibold text-white">How to approve a new admin</p>
            <p>1. Let the staff member sign in once with Google.</p>
            <p>2. In Supabase, update their `public.users.role` value to `admin`.</p>
            <p>3. They can then use `/adminpanel/login` and will be routed into the separate admin panel.</p>
          </div>

          <p className="mt-6 text-sm text-slate-300">
            Already approved?{' '}
            <Link to="/adminpanel/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Go to admin login
            </Link>
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Student signup remains at{' '}
            <Link to="/signup" className="font-semibold text-slate-200 hover:text-white">
              /signup
            </Link>
            .
          </p>
        </div>
      </AuthCard>
    </div>
  )
}
