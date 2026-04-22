import { SectionHeading } from '../layout/SectionHeading'
import type { TeamMember } from '../../types/models'

interface TeamSectionProps {
  members: TeamMember[]
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section className="px-4 py-28 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Team"
          title="Meet the MC Mathematics team"
          description="A focused academic and operations team supporting lesson quality, class delivery, student coordination, and digital updates around the institute."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {members.slice(0, 5).map((member) => (
            <article
              key={member.id}
              className="glass-panel group rounded-[2rem] p-5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(34,211,238,0.14)]"
            >
              <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-slate-950/45">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <p className="font-display mt-5 text-2xl font-semibold text-white">{member.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan-300">{member.role}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
