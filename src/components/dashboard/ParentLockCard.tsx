import { addMinutes, isAfter } from 'date-fns'
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
  const [unlockAttempt, setUnlockAttempt] = useState('')
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
    toast.success('Parent lock enabled')
  }

  function unlock() {
    if (unlockAttempt !== (profile.parent_lock_password ?? password)) {
      toast.error('Incorrect parent lock password')
      return
    }

    localStorage.removeItem(STORAGE_KEY)
    setLocked(false)
    setUnlockAttempt('')
    toast.success('Dashboard unlocked')
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <h3 className="font-display text-2xl font-semibold text-white">Parent Lock</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Add a temporary lock on dashboard access. It is stored locally and can also be synced into Supabase for device continuity.
      </p>

      {locked ? (
        <div className="mt-6 rounded-[1.6rem] border border-rose-500/20 bg-rose-500/[0.04] p-5">
          <p className="text-sm text-rose-200">Dashboard is currently locked.</p>
          <input
            type="password"
            placeholder="Enter parent password"
            value={unlockAttempt}
            onChange={(event) => setUnlockAttempt(event.target.value)}
            className="glass-input mt-4 px-4 py-3"
          />
          <button
            onClick={unlock}
            className="glass-button mt-4 px-5 py-3 font-semibold text-slate-950"
          >
            Unlock now
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            </select>
          </label>
          <div className="md:col-span-2">
            <button
              onClick={() => void activateLock()}
              className="glass-button px-5 py-3 font-semibold text-slate-950"
            >
              Enable parent lock
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
