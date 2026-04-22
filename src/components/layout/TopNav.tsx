import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../providers/auth-context'
import { cn } from '../../lib/utils'
import { ThemeToggle } from './ThemeToggle'

export function TopNav() {
  const [open, setOpen] = useState(false)
  const { profile, loginWithGoogle, logout } = useAuth()

  const links = [
    { label: 'Home', href: '#hero' },
    { label: 'Hall of Fame', href: '#hall-of-fame' },
    { label: 'Classes', href: '#classes' },
    { label: 'Announcements', href: '#announcements' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-40 mx-auto w-full px-4 pt-4 md:px-6 lg:px-8">
      <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
        <Link to="/landingpage" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 accent-border">
            <span className="font-display text-lg font-bold">MC</span>
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">MC Mathematics</p>
            <p className="text-xs text-slate-400">Question is Maths, Answer is MC</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-white">
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          {profile ? (
            <>
              <NavLink to="/userdashboard" className="text-sm text-slate-200">
                Dashboard
              </NavLink>
              <button
                onClick={() => void logout()}
                className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/signup" className="text-sm text-slate-200 transition hover:text-white">
                Sign Up
              </Link>
              <button
                onClick={() => void loginWithGoogle()}
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300"
              >
                Sign Up with Google
              </button>
            </div>
          )}
        </nav>

        <button
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-cyan-400/20 p-2 text-slate-200 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="glass-panel mx-auto mt-3 max-w-7xl rounded-3xl p-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <div className="mb-1 flex justify-end">
              <ThemeToggle />
            </div>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false)
                if (profile) {
                  void logout()
                } else {
                  void loginWithGoogle()
                }
              }}
              className={cn(
                'rounded-2xl px-3 py-2 text-sm font-semibold',
                profile ? 'border border-cyan-400/20 text-cyan-200' : 'bg-cyan-400 text-slate-950',
              )}
            >
              {profile ? 'Log out' : 'Sign Up with Google'}
            </button>
            {!profile ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 px-3 py-2 text-center text-sm text-slate-300"
              >
                Go to Login
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
