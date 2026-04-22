import { Moon, SunMedium } from 'lucide-react'
import { useTheme } from '../../providers/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-cyan-400/20 bg-white/5 p-2.5 text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10"
      aria-label="Toggle color theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  )
}
