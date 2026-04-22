import { Quote, Star } from 'lucide-react'
import { SectionHeading } from '../layout/SectionHeading'
import { EmptyState } from '../shared/EmptyState'
import type { FeedbackEntry } from '../../types/models'

interface FeedbackSectionProps {
  feedback: FeedbackEntry[]
}

export function FeedbackSection({ feedback }: FeedbackSectionProps) {
  return (
    <section className="px-4 py-28 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Student Feedback"
          title="What students say about MC Mathematics"
          description="Real progress is built on clear explanations, disciplined class flow, and a structure that helps students understand what to work on next."
        />

        {feedback.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {feedback.map((item) => (
              <article key={item.id} className="glass-panel rounded-[2rem] p-6 transition duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Quote size={18} />
                  </div>
                  <div className="flex items-center gap-1 text-amber-300">
                    {Array.from({ length: item.rating ?? 5 }, (_, index) => (
                      <Star key={index} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-sm leading-8 text-slate-300">"{item.feedback}"</p>
                <div className="mt-5 border-t border-white/8 pt-4">
                  <p className="font-display text-xl font-semibold text-white">{item.student_name}</p>
                  <p className="mt-1 text-sm text-slate-400">Grade {item.grade ?? '-'}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="Feedback will show here"
              description="Add testimonials to Supabase and this section will populate automatically."
            />
          </div>
        )}
      </div>
    </section>
  )
}
