import type { Announcement } from '../../types/models'
import { EmptyState } from '../shared/EmptyState'

interface AnnouncementsTickerProps {
  announcements: Announcement[]
}

export function AnnouncementsTicker({ announcements }: AnnouncementsTickerProps) {
  const track = [...announcements, ...announcements]

  return (
    <section id="announcements" className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-400/18 bg-slate-950/50 px-6 py-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">Announcements</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-white">Live updates from MC</h2>
          </div>
          <div className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-200">
            Auto-scrolling
          </div>
        </div>

        {announcements.length ? (
          <div className="overflow-hidden">
            <div className="ticker-track flex min-w-max gap-4">
              {track.map((announcement, index) => (
                <article
                  key={`${announcement.id}-${index}`}
                  className="min-w-[300px] rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5 md:min-w-[420px]"
                >
                  <p className="font-display text-lg font-semibold text-white">{announcement.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{announcement.body}</p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Announcements will show here"
            description="Once you publish announcements from the admin side, they will scroll here automatically."
          />
        )}
      </div>
    </section>
  )
}
