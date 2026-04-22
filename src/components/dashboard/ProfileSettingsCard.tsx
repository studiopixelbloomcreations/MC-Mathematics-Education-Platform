import { useState } from 'react'
import toast from 'react-hot-toast'
import { saveUserProfile } from '../../lib/supabaseApi'
import { useTheme } from '../../providers/theme-context'
import type { UserProfile } from '../../types/models'

interface ProfileSettingsCardProps {
  profile: UserProfile
  onUpdated: (profile: UserProfile) => void
}

export function ProfileSettingsCard({ profile, onUpdated }: ProfileSettingsCardProps) {
  const { theme, setTheme } = useTheme()
  const [customization, setCustomization] = useState('Neon Focus')
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    address: profile.address ?? '',
    phone_number: profile.phone_number ?? '',
    whatsapp_number: profile.whatsapp_number ?? '',
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const updated = await saveUserProfile(profile.user_id, form)
    toast.success('Profile updated')
    onUpdated(updated)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.72fr]">
      <form onSubmit={handleSubmit} className="glass-panel accent-border rounded-[2rem] p-6">
        <h3 className="font-display text-2xl font-semibold text-white">Profile settings</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">Update your Supabase profile information.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ['Full Name', 'full_name'],
            ['Phone Number', 'phone_number'],
            ['WhatsApp Number', 'whatsapp_number'],
          ].map(([label, key]) => (
            <label key={key} className="block">
              <span className="mb-3 block text-sm text-slate-300">{label}</span>
              <input
                value={form[key as keyof typeof form]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.value }))
                }
                className="glass-input px-4 py-3"
              />
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="mb-3 block text-sm text-slate-300">Address</span>
            <textarea
              rows={3}
              value={form.address}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
              className="glass-textarea px-4 py-3"
            />
          </label>
        </div>
        <button
          type="submit"
          className="glass-button mt-6 px-5 py-3 font-semibold text-slate-950"
        >
          Save changes
        </button>
      </form>

      <div className="glass-panel accent-border rounded-[2rem] p-6">
        <h3 className="font-display text-2xl font-semibold text-white">UI customization</h3>
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-slate-300">Theme toggle</p>
            <div className="mt-3 flex gap-3">
              {(['dark', 'light'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`px-4 py-2 text-sm font-semibold ${
                    theme === mode
                      ? 'glass-button text-slate-950'
                      : 'glass-button-secondary text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-300">Dashboard accent preset</p>
            <select
              value={customization}
              onChange={(event) => setCustomization(event.target.value)}
              className="glass-select mt-3 px-4 py-3"
            >
              <option>Neon Focus</option>
              <option>Blue Matrix</option>
              <option>Exam Sprint</option>
            </select>
          </div>
          <div className="rounded-[1.6rem] border border-cyan-400/12 bg-cyan-400/[0.04] p-4 text-sm leading-7 text-slate-300">
            Theme preferences are stored locally now and can optionally be synced through Supabase later.
          </div>
        </div>
      </div>
    </div>
  )
}
