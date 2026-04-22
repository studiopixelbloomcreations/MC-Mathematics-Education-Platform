import { useEffect, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AuthCard } from '../components/auth/AuthCard'
import { ensureStudentId, saveUserProfile } from '../lib/supabaseApi'
import { useAuth } from '../providers/auth-context'
import type { EnrollmentType } from '../types/models'

const SIGNUP_DRAFT_KEY = 'mc-signup-draft'

function getSignupDraft() {
  const defaults = {
    form: {
      full_name: '',
      grade: '8',
      age: '14',
      address: '',
      phone_number: '',
      whatsapp_number: '',
      enrollment_type: 'both' as EnrollmentType,
    },
    sameAsPhone: true,
  }

  const saved = localStorage.getItem(SIGNUP_DRAFT_KEY)
  if (!saved) return defaults

  try {
    const parsed = JSON.parse(saved) as typeof defaults.form & { sameAsPhone?: boolean }
    return {
      form: {
        full_name: parsed.full_name ?? '',
        grade: parsed.grade ?? '8',
        age: parsed.age ?? '14',
        address: parsed.address ?? '',
        phone_number: parsed.phone_number ?? '',
        whatsapp_number: parsed.whatsapp_number ?? '',
        enrollment_type: parsed.enrollment_type ?? 'both',
      },
      sameAsPhone: parsed.sameAsPhone ?? true,
    }
  } catch {
    localStorage.removeItem(SIGNUP_DRAFT_KEY)
    return defaults
  }
}

export function SignupPage() {
  const navigate = useNavigate()
  const { firebaseUser, profile, loginWithGoogle, refreshProfile } = useAuth()
  const initialDraft = getSignupDraft()
  const [sameAsPhone, setSameAsPhone] = useState(initialDraft.sameAsPhone)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialDraft.form)

  useEffect(() => {
    if (firebaseUser && profile?.full_name && profile.grade) {
      navigate('/userdashboard', { replace: true })
    }
  }, [firebaseUser, profile, navigate])

  async function handleGoogleSignup() {
    localStorage.setItem(
      SIGNUP_DRAFT_KEY,
      JSON.stringify({
        ...form,
        sameAsPhone,
      }),
    )
    await loginWithGoogle()
  }

  async function handleCompleteSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!firebaseUser) {
      toast('Please continue with Google Sign-In first.')
      await handleGoogleSignup()
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        full_name: form.full_name || firebaseUser.displayName || '',
        grade: Number(form.grade),
        age: Number(form.age),
        address: form.address,
        phone_number: form.phone_number,
        whatsapp_number: sameAsPhone ? form.phone_number : form.whatsapp_number,
        email: firebaseUser.email ?? profile?.email ?? '',
        enrollment_type: form.enrollment_type,
      }

      let nextProfile = await saveUserProfile(firebaseUser.uid, payload)
      if (!nextProfile.student_id) {
        const studentId = await ensureStudentId(firebaseUser.uid, payload.grade, payload.enrollment_type)
        if (studentId) {
          nextProfile = await saveUserProfile(firebaseUser.uid, { student_id: studentId })
        }
      }

      await refreshProfile()
      localStorage.removeItem(SIGNUP_DRAFT_KEY)
      toast.success('Signup completed successfully')
      navigate('/userdashboard', { replace: true })
      return nextProfile
    } catch {
      toast.error('Unable to complete signup right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 md:px-6 lg:px-8">
      <AuthCard
        eyebrow="Signup"
        title="Create your MC Mathematics student profile"
        description="Complete your academic details and continue with Google Sign-In. Your Firebase UID will become your Supabase user ID, and your student ID will be generated automatically."
      >
        <form onSubmit={handleCompleteSignup} className="rounded-[1.8rem] border border-white/8 bg-slate-950/45 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <input
                required
                value={form.full_name}
                onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
                className="glass-input px-4 py-3"
              />
            </Field>
            <Field label="Grade">
              <select
                value={form.grade}
                onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value }))}
                className="glass-select px-4 py-3"
              >
                {[6, 7, 8, 9, 10, 11].map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Age">
              <input
                required
                type="number"
                min={8}
                max={30}
                value={form.age}
                onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                className="glass-input px-4 py-3"
              />
            </Field>
            <Field label="Enrollment">
              <select
                value={form.enrollment_type}
                onChange={(event) =>
                  setForm((current) => ({ ...current, enrollment_type: event.target.value as EnrollmentType }))
                }
                className="glass-select px-4 py-3"
              >
                <option value="theory">Theory only</option>
                <option value="paper">Paper only</option>
                <option value="both">Both</option>
              </select>
            </Field>
            <Field label="Address" className="md:col-span-2">
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className="glass-textarea px-4 py-3"
              />
            </Field>
            <Field label="Phone Number">
              <input
                required
                value={form.phone_number}
                onChange={(event) => setForm((current) => ({ ...current, phone_number: event.target.value }))}
                className="glass-input px-4 py-3"
              />
            </Field>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(event) => setSameAsPhone(event.target.checked)}
                  className="h-4 w-4"
                />
                Same as phone number
              </label>
              {!sameAsPhone ? (
                <input
                  required
                  value={form.whatsapp_number}
                  onChange={(event) => setForm((current) => ({ ...current, whatsapp_number: event.target.value }))}
                  placeholder="WhatsApp Number"
                  className="glass-input mt-4 px-4 py-3"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-3 block text-sm text-slate-300">Email</span>
                <input
                  disabled
                  placeholder="Will come from Google Sign-In"
                  className="glass-input cursor-not-allowed px-4 py-3 text-slate-500"
                />
              </label>
              <label className="block">
                <span className="mb-3 block text-sm text-slate-300">Password</span>
                <input
                  disabled
                  type="password"
                  placeholder="Manual auth unavailable"
                  className="glass-input cursor-not-allowed px-4 py-3 text-slate-500"
                />
              </label>
            </div>
            <p className="mt-4 text-sm text-amber-200">Manual auth currently unavailable. Use Google Sign-In.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleGoogleSignup()}
              className="glass-button inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-slate-950"
            >
              Continue with Google
              <ArrowRight size={18} />
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="glass-button-secondary px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Complete Signup'}
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-300">
            Already have access?{' '}
            <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Go to login
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-3 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}
