import { cn } from '../../lib/utils'

interface StatusPillProps {
  label: string
  tone?: 'info' | 'success' | 'danger' | 'muted'
}

export function StatusPill({ label, tone = 'info' }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        tone === 'success' && 'bg-emerald-400/12 text-emerald-300',
        tone === 'danger' && 'bg-rose-500/12 text-rose-300',
        tone === 'muted' && 'bg-slate-400/10 text-slate-300',
        tone === 'info' && 'bg-cyan-400/12 text-cyan-300',
      )}
    >
      {label}
    </span>
  )
}
