import type { PropsWithChildren } from 'react'
import { BookOpenCheck } from 'lucide-react'

interface AuthCardProps extends PropsWithChildren {
  eyebrow: string
  title: string
  description: string
}

export function AuthCard({ eyebrow, title, description, children }: AuthCardProps) {
  return (
    <div className="glass-panel accent-border relative w-full max-w-5xl overflow-hidden rounded-[2rem] p-6 md:p-8">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
            <BookOpenCheck size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">{eyebrow}</p>
            <h1 className="font-display mt-4 text-4xl font-semibold text-white">{title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300">{description}</p>
          </div>
          <div className="rounded-[1.6rem] border border-cyan-400/14 bg-cyan-400/[0.04] p-4 text-sm leading-7 text-slate-300">
            Firebase handles authentication only. All academic and student profile data is stored in Supabase.
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
