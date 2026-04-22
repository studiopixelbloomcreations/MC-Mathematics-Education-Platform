import { BarChart3, Bell, BookOpen, LayoutGrid, Lock, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DashboardSidebarProps {
  active: string
  onChange: (value: string) => void
}

const items = [
  ['overview', 'Overview', LayoutGrid],
  ['statistics', 'Statistics', BarChart3],
  ['classes', 'Classes', BookOpen],
  ['announcements', 'Announcements', Bell],
  ['class-stats', 'Class Statistics', LayoutGrid],
  ['settings', 'Settings', Settings],
  ['parent-lock', 'Parent Lock', Lock],
] as const

export function DashboardSidebar({ active, onChange }: DashboardSidebarProps) {
  return (
    <aside className="glass-panel scrollbar-soft h-fit rounded-[2rem] p-5 lg:sticky lg:top-6">
      <div className="mb-5 border-b border-white/8 pb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Student panel</p>
        <h2 className="font-display mt-3 text-2xl font-semibold text-white">Dashboard</h2>
      </div>
      <div className="space-y-3">
        {items.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm transition',
              active === id
                ? 'bg-cyan-400 text-slate-950'
                : 'text-slate-300 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  )
}
