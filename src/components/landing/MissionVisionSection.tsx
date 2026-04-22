import { Compass, Target } from 'lucide-react'
import { SectionHeading } from '../layout/SectionHeading'

export function MissionVisionSection() {
  const cards = [
    {
      icon: Target,
      title: 'Mission',
      body: 'Turn mathematical uncertainty into disciplined confidence with structured theory teaching, paper fluency, and measurable progress.',
    },
    {
      icon: Compass,
      title: 'Vision',
      body: 'Create a next-generation institute where class planning, teacher feedback, analytics, and student growth move together in real time.',
    },
  ]

  return (
    <section className="px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Institute DNA"
          title="Mission and Vision"
          description="Built around smart automation and human teaching quality, MC Mathematics balances classroom rigor with a digital experience students actually want to keep using."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.title} className="glass-panel rounded-[2rem] p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                  <Icon size={24} />
                </div>
                <h3 className="font-display mt-6 text-3xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 md:text-base">{card.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
