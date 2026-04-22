import { ArrowRight, BookOpen, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroAsset from '../../assets/hero.png'

export function HeroSection() {
  return (
    <section id="hero" className="relative px-4 pb-16 pt-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/6 px-4 py-2 text-sm text-cyan-200">
            <Sparkles size={16} />
            Premium mathematics coaching for Grades 6 to 11
          </div>

          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.42em] text-slate-400">
              Malinga C. Dissanayaka
            </p>
            <h1 className="font-display max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
              Question is Maths. <span className="text-gradient">Answer is MC.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              MC Mathematics by Malinga C. Dissanayaka blends theory teaching, paper practice, disciplined class
              guidance, and modern student support into one focused mathematics institute experience based at Lexicon
              Kurunegala.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/login"
              className="glass-button inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-slate-950"
            >
              Log In
              <ArrowRight size={18} />
            </Link>
            <a
              href="#classes"
              className="glass-button-secondary inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white"
            >
              View Classes
            </a>
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
          <div className="absolute -right-10 top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative space-y-6">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.8rem] border border-white/8 bg-slate-950/55 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                  <img src={heroAsset} alt="Mathematics visual" className="h-10 w-10 object-contain" />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-cyan-300/80">Lead teacher</p>
                <h2 className="font-display mt-3 text-3xl font-semibold text-white">Malinga C. Dissanayaka</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Structured lessons, consistent paper guidance, and focused mathematics discipline for school students.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  ['Class Stream', 'Theory + Paper'],
                  ['Grades', '6 to 11'],
                  ['Mode', 'Hall + Online support'],
                ].map(([title, value]) => (
                  <div key={title} className="rounded-3xl border border-white/6 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
                    <p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-cyan-400/12 bg-slate-950/55 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">Smart learning path</p>
                    <p className="text-sm text-slate-400">Normal classes and paper classes</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Every batch is organized around lesson progression, announcements, schedules, and targeted exam
                  preparation.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-cyan-400/12 bg-slate-950/55 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">Institute support</p>
                    <p className="text-sm text-slate-400">Operating from Lexicon Kurunegala</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Rooted in Lexicon Kurunegala and currently operating from Lexicon Kurunegala, MC Mathematics keeps
                  students and parents connected through one organized institute platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
