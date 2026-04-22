import { format } from 'date-fns'
import { useCurrentTime } from '../../hooks/useCurrentTime'
import { formatClassStatusLabel, getComputedClassStatus, getClassStatusTone } from '../../lib/utils'
import { SectionHeading } from '../layout/SectionHeading'
import { EmptyState } from '../shared/EmptyState'
import { StatusPill } from '../shared/StatusPill'
import type { ManagedClass } from '../../types/models'

interface ClassesSectionProps {
  classes: ManagedClass[]
}

export function ClassesSection({ classes }: ClassesSectionProps) {
  const now = useCurrentTime()

  return (
    <section id="classes" className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Schedules"
          title="Theory and Paper Classes"
          description="Timings, venues, and batch plans update live from Supabase so students always see the correct schedule across the public site and dashboard."
        />

        {classes.length ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {classes.map((item) => (
              <article key={item.id} className="glass-panel rounded-[2rem] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Grade {item.grade}</p>
                    <h3 className="font-display mt-2 text-2xl font-semibold text-white">{item.class_name}</h3>
                  </div>
                  <StatusPill
                    label={formatClassStatusLabel(getComputedClassStatus(item, now))}
                    tone={getClassStatusTone(getComputedClassStatus(item, now))}
                  />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Date</p>
                    <p className="mt-2 text-sm text-slate-200">
                      {format(new Date(item.class_date), 'EEE, MMM d')}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Time</p>
                    <p className="mt-2 text-sm text-slate-200">{item.time_label ?? 'Will be announced'}</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Venue</p>
                    <p className="mt-2 text-sm text-slate-200">{item.venue ?? 'MC Campus'}</p>
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
