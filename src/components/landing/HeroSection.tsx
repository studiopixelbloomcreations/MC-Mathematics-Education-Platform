import { ArrowRight, Calculator, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/auth-context'

export function HeroSection() {
  const { loginWithGoogle, profile } = useAuth()

  return (
    <section id="hero" className="relative px-4 pb-16 pt-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/6 px-4 py-2 text-sm text-cyan-200">
            <Sparkles size={16} />
            Premium mathematics coaching, analytics, and real-time student support
          </div>

          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.42em] text-slate-400">
              Malinga C. Dissanayaka
            </p>
            <h1 className="font-display max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
              Mathematical clarity with <span className="text-gradient">discipline, elegance, and momentum.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Question is Maths, Answer is MC. A modern hybrid platform for focused theory mastery, paper practice,
              live schedules, announcements, and progress tracking from one premium experience.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => void loginWithGoogle()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300"
            >
              Sign Up with Google
              <ArrowRight size={18} />
            </button>
            <Link
              to={profile ? '/userdashboard' : '/landingpage'}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/5"
            >
              Explore Student Experience
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Grades 6-11', 'Structured pathways'],
              ['Realtime updates', 'Announcements and classes'],
              ['Performance insight', 'Marks, lessons, paper progress'],
            ].map(([title, note]) => (
              <div key={title} className="glass-panel rounded-3xl p-5">
                <p className="font-display text-xl font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel accent-border relative overflow-hidden rounded-[2rem] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.16),transparent_40%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Math engine</p>
                <p className="font-display text-2xl font-semibold text-white">Precision dashboard</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                <Calculator size={24} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Theory Coverage', '82%'],
                ['Upcoming Paper', 'Challenge 02'],
                ['Grade Sync', 'Auto-mapped'],
                ['Realtime Feed', 'Supabase live'],
              ].map(([title, value]) => (
                <div key={title} className="rounded-3xl border border-white/6 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
                  <p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-cyan-400/12 bg-slate-950/55 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-lg font-semibold text-white">Login mode</p>
                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Google active
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-slate-300">
                  Email/Password UI is visible for product completeness but manual auth is currently disabled.
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Database identity</p>
                    <p className="mt-2 text-sm text-slate-300">Firebase UID becomes `users.user_id` in Supabase.</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Deployment</p>
                    <p className="mt-2 text-sm text-slate-300">Netlify-ready frontend with Supabase realtime data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
