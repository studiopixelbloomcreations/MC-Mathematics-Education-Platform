import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

export function ContactSection() {
  const contactCards = [
    {
      label: 'Phone',
      value: '0712827519',
      icon: Phone,
      description: 'Direct line for urgent class and enrollment communication.',
    },
    {
      label: 'WhatsApp',
      value: '0712382728',
      icon: MessageCircle,
      description: 'Quick updates, parent coordination, and student follow-up.',
    },
    {
      label: 'Email',
      value: 'malingacdissanayake@gmail.com',
      icon: Mail,
      description: 'Formal inquiries, confirmations, and institute correspondence.',
    },
    {
      label: 'Location',
      value: 'Lexicon Kurunegala',
      icon: MapPin,
      description: 'Current operating venue of MC Mathematics.',
    },
    {
      label: 'Hours',
      value: 'Class-day based',
      icon: Clock3,
      description: 'Contact is best during active institute hours and class days.',
    },
  ]

  return (
    <section id="contact" className="px-4 pb-24 pt-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-[2rem] p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Contact</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-white">Reach MC Mathematics</h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                For enrollment inquiries, class schedules, paper-class clarifications, or institute updates, students
                and parents can reach MC Mathematics through the official contact channels below.
              </p>
              <div className="rounded-[1.6rem] border border-cyan-400/14 bg-cyan-400/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">Institute Base</p>
                <p className="mt-3 font-display text-2xl font-semibold text-white">Lexicon Kurunegala</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  MC Mathematics is rooted in Lexicon Kurunegala and is currently operating from Lexicon Kurunegala for
                  its core institute activities and student coordination.
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {contactCards.map((card) => {
                const Icon = card.icon
                return (
                <div key={card.label} className="rounded-[1.6rem] border border-white/8 bg-slate-950/45 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Icon size={20} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                  <p className="mt-3 break-words font-display text-xl font-semibold text-white">{card.value}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
