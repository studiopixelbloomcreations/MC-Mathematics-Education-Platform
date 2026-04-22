import { useMemo, useState } from 'react'
import { SectionHeading } from '../layout/SectionHeading'
import type { HallOfFameEntry } from '../../types/models'

interface HallOfFameSectionProps {
  entries: HallOfFameEntry[]
}

export function HallOfFameSection({ entries }: HallOfFameSectionProps) {
  const [tab, setTab] = useState<'A/L' | 'O/L'>('A/L')
  const filtered = useMemo(() => entries.filter((entry) => entry.category === tab), [entries, tab])

  return (
    <section id="hall-of-fame" className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Achievement"
          title="Hall of Fame"
          description="Celebrate standout students across O/L and A/L streams with a gallery that can be managed directly from Supabase storage and admin workflows."
        />

        <div className="mt-10 flex gap-3">
          {(['A/L', 'O/L'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                tab === item
                  ? 'bg-cyan-400 text-slate-950'
                  : 'border border-white/10 text-slate-300 hover:border-cyan-300/30 hover:bg-white/5'
              }`}
            >
              {item} Students
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((entry) => (
            <article
              key={entry.id}
              className="glass-panel overflow-hidden rounded-[2rem] transition duration-500 hover:-translate-y-1 hover:border-cyan-300/20"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={entry.image_url}
                  alt={entry.student_name}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">{entry.category}</p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-white">{entry.student_name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{entry.achievement}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
