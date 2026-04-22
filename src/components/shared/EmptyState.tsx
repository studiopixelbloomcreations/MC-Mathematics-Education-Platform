interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="glass-panel rounded-3xl border border-dashed border-cyan-400/20 p-6 text-center">
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  )
}
