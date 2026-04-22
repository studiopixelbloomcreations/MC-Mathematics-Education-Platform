import { format } from 'date-fns'
import { useMemo } from 'react'
import { SectionHeading } from '../layout/SectionHeading'
import { EmptyState } from '../shared/EmptyState'
import type { ManagedClass } from '../../types/models'

interface ClassesSectionProps {
  classes: ManagedClass[]
}

export function ClassesSection({ classes }: ClassesSectionProps) {
  const schedules = useMemo(() => {
    const unique = new Map<
      string,
      ManagedClass & {
        weekdayLabel: string
      }
    >()

    classes.forEach((item) => {
      const weekdayLabel = format(new Date(item.class_date), 'EEEE')
      const key = [item.grade, item.class_name, weekdayLabel, item.time_label ?? '', item.venue ?? ''].join('|')

      if (!unique.has(key)) {
        unique.set(key, {
          ...item,
          weekdayLabel,
        })
      }
    })

    return [...unique.values()].sort((first, second) => {
      const firstDate = new Date(first.class_date)
      const secondDate = new Date(second.class_date)
      const weekdayDelta = firstDate.getDay() - secondDate.getDay()
      if (weekdayDelta !== 0) return weekdayDelta
      return first.grade - second.grade
    })
  }, [classes])

  return (
    <section id="classes" className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Schedules"
          title="Theory and Paper Classes"
          description="A clean weekly class schedule for each batch, so students can instantly see the correct class, day, and time."
        />

        {schedules.length ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {schedules.map((item) => (
              <article key={`${item.class_name}-${item.weekdayLabel}-${item.time_label ?? 'tba'}`} className="glass-panel rounded-[2rem] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Grade {item.grade}</p>
                    <h3 className="font-display mt-2 text-2xl font-semibold text-white">{item.class_name}</h3>
                    <p className="mt-4 text-base font-medium text-cyan-200">
                      {item.weekdayLabel} {item.time_label ? `• ${item.time_label}` : ''}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{item.venue ?? 'Lexicon Kurunegala'}</p>
                  </div>
                  <div className="rounded-full border border-cyan-400/18 bg-cyan-400/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Weekly
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="Class schedule coming soon"
              description="Add upcoming classes in Supabase and they will appear here automatically."
            />
          </div>
        )}
      </div>
    </section>
  )
}
