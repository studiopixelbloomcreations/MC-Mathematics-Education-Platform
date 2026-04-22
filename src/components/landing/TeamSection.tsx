const team = [
  {
    name: 'Malinga C. Dissanayaka',
    role: 'Lead Mathematics Teacher',
    description: 'Driving theory clarity, paper strategy, and a disciplined exam-oriented culture across all grades.',
  },
  {
    name: 'Progress Support System',
    role: 'Realtime Analytics Layer',
    description: 'Student marks, announcements, schedules, and teacher notes synchronized into one focused workflow.',
  },
]

export function TeamSection() {
  return (
    <section className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-[2rem] p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Team</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-white md:text-5xl">
                Small team. Sharp execution.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                A premium institute doesn’t need noise. It needs excellent teaching, disciplined class delivery, and
                systems that support progress every week.
              </p>
            </div>

            <div className="grid gap-5">
              {team.map((member) => (
                <article key={member.name} className="rounded-[1.6rem] border border-white/8 bg-slate-950/45 p-6">
                  <p className="font-display text-2xl font-semibold text-white">{member.name}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-cyan-300">{member.role}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{member.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
