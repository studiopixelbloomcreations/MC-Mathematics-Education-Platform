import type { PropsWithChildren } from 'react'

interface AdminFormCardProps extends PropsWithChildren {
  title: string
  description: string
}

export function AdminFormCard({ title, description, children }: AdminFormCardProps) {
  return (
    <div className="glass-panel accent-border rounded-[2rem] p-6">
      <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}
