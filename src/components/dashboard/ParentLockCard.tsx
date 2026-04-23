import { addMinutes, isAfter } from 'date-fns'
import { Clock, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { saveUserProfile } from '../../lib/supabaseApi'
import type { UserProfile } from '../../types/models'

const STORAGE_KEY = 'mc-parent-lock'

interface ParentLockCardProps {
  profile: UserProfile
  onUpdated: (profile: UserProfile) => void
}

export function ParentLockCard({ profile, onUpdated }: ParentLockCardProps) {
  const [password, setPassword] = useState('')
  const [duration, setDuration] = useState('15')
  const [locked, setLocked] = useState(() => {
    const local = localStorage.getItem(STORAGE_KEY)
    return local ? isAfter(new Date(local), new Date()) : false
  })

  async function activateLock() {
    if (!password) {
      toast.error('Enter a password for parent lock.')
      return
    }

    const until = addMinutes(new Date(), Number(duration)).toISOString()
    localStorage.setItem(STORAGE_KEY, until)
    setLocked(true)
    const updated = await saveUserProfile(profile.user_id, {
      parent_lock_password: password,
      parent_lock_until: until,
    })
    onUpdated(updated)
    toast.success('Parent lock enabled — dashboard is now locked')

    // Force page reload so the overlay picks up the new lock state
    window.location.reload()
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <h3 className="font-display text-2xl font-semibold text-white">Parent Lock</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Temporarily lock the dashboard so the student cannot access it. The lock will lift automatically after the chosen duration or when the correct password is entered on the overlay.
      </p>

      {locked ? (
        <div className="mt-6 rounded-[1.6rem] border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
              <ShieldCheck size={20} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-200">Dashboard is locked</p>
              <p className="mt-1 text-xs text-slate-400">
                The student will see a full-screen lock overlay. The lock will auto-expire or can be unlocked with the password.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Clock size={14} className="text-slate-500" />
            <p className="text-xs text-slate-400">
              Lock active until the timer expires or manual unlock.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Set a parent password"
              className="glass-input px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="mb-3 block text-sm text-slate-300">Duration</span>
            <select
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="glass-select px-4 py-3"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <button
              onClick={() => void activateLock()}
              className="glass-button inline-flex items-center gap-2 px-5 py-3 font-semibold text-slate-950"
            >
              <Lock size={16} />
              Enable parent lock
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
