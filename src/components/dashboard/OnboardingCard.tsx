import { useState } from 'react'
import toast from 'react-hot-toast'
import { ensureStudentId, saveUserProfile } from '../../lib/supabaseApi'
import { useAuth } from '../../providers/auth-context'
import type { EnrollmentType, UserProfile } from '../../types/models'

interface OnboardingCardProps {
  profile: UserProfile
  onComplete: (profile: UserProfile) => void
}

export function OnboardingCard({ profile, onComplete }: OnboardingCardProps) {
  const { refreshProfile } = useAuth()
  const [sameAsPhone, setSameAsPhone] = useState(profile.whatsapp_number === profile.phone_number)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    grade: String(profile.grade ?? 8),
    age: String(profile.age ?? 13),
    address: profile.address ?? '',
    phone_number: profile.phone_number ?? '',
    whatsapp_number: profile.whatsapp_number ?? '',
    enrollment_type: (profile.enrollment_type ?? 'both') as EnrollmentType,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        grade: Number(form.grade),
        age: Number(form.age),
        whatsapp_number: sameAsPhone ? form.phone_number : form.whatsapp_number,
      }

      let nextProfile = await saveUserProfile(profile.user_id, payload)
      if (!nextProfile.student_id) {
        const studentId = await ensureStudentId(profile.user_id, payload.grade, payload.enrollment_type)
        if (studentId) {
          nextProfile = await saveUserProfile(profile.user_id, { student_id: studentId })
        }
      }

      await refreshProfile()
      onComplete(nextProfile)
      toast.success('Profile completed successfully')
    } catch {
      toast.error('Unable to save your profile right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const incomplete =
    !profile.full_name || !profile.grade || !profile.age || !profile.address || !profile.phone_number || !profile.enrollment_type

  if (!incomplete) return null

  return (
    <section className="glass-panel accent-border rounded-[2rem] p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Student setup</p>
        <h2 className="font-display mt-3 text-3xl font-semibold text-white">Complete your profile</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          We use Firebase only for authentication. Your academic profile lives in Supabase and needs these details to
          generate the correct MC student ID and grade-based data sync.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
            <option value="both">Theory + Paper</option>
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
        <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={sameAsPhone}
              onChange={(event) => setSameAsPhone(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-slate-950"
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

        <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-[1.6rem] border border-cyan-400/12 bg-cyan-400/[0.04] p-4">
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Student ID is generated from grade + enrollment type using Supabase automation.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="glass-button px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-3 block text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  )
}
