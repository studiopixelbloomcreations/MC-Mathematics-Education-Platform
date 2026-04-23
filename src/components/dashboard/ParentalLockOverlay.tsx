import { ArrowLeft, Clock, Shield, Unlock } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface ParentalLockOverlayProps {
  password: string
  lockUntil: string
  onUnlock: () => void
}

function formatTimeLeft(ms: number) {
  if (ms <= 0) return '00:00'
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ParentalLockOverlay({ password, lockUntil, onUnlock }: ParentalLockOverlayProps) {
  const [phase, setPhase] = useState<'locked' | 'unlocking'>('locked')
  const [attempt, setAttempt] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(lockUntil).getTime() - Date.now()
    return diff > 0 ? diff : 0
  })
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-unlock countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(lockUntil).getTime() - Date.now()
      if (diff <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        localStorage.removeItem('mc-parent-lock')
        toast.success('Parent lock timer expired — dashboard unlocked')
        onUnlock()
        return
      }
      setTimeLeft(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [lockUntil, onUnlock])

  // Focus password input when entering unlock phase
  useEffect(() => {
    if (phase === 'unlocking' && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 420)
      return () => clearTimeout(timer)
    }
  }, [phase])

  function switchToUnlocking() {
    setTransitioning(true)
    setTimeout(() => {
      setPhase('unlocking')
      setTransitioning(false)
    }, 320)
  }

  function switchToLocked() {
    setTransitioning(true)
    setAttempt('')
    setTimeout(() => {
      setPhase('locked')
      setTransitioning(false)
    }, 320)
  }

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (attempt === password) {
        localStorage.removeItem('mc-parent-lock')
        toast.success('Dashboard unlocked')
        onUnlock()
      } else {
        toast.error('Incorrect parent lock password')
        setAttempt('')
      }
    },
    [attempt, password, onUnlock],
  )

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    opacity: transitioning ? 0 : 1,
    transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
    transition: 'opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
  }

  return (
    <div className="liquid-glass-overlay">
      <div className="liquid-glass-card" style={{ textAlign: 'center' }}>
        {phase === 'locked' ? (
          <div style={contentStyle}>
            <div
              className="liquid-lock-icon"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(103, 232, 249, 0.18)',
                marginBottom: '1.6rem',
              }}
            >
              <Shield size={32} style={{ color: 'rgba(103, 232, 249, 0.9)' }} />
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 0.6rem',
                letterSpacing: '-0.01em',
              }}
            >
              Parental Lock Is Active
            </h2>

            <p
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(148, 163, 184, 0.9)',
                lineHeight: 1.7,
                margin: '0 0 1.6rem',
              }}
            >
              The dashboard is temporarily locked by a parent or guardian.
            </p>

            <div className="liquid-timer-pill" style={{ margin: '0 auto 2rem' }}>
              <Clock size={15} />
              <span>{formatTimeLeft(timeLeft)}</span>
              <span style={{ fontWeight: 400, opacity: 0.7 }}>remaining</span>
            </div>

            <button
              className="liquid-glass-link"
              onClick={switchToUnlocking}
              style={{ margin: '0 auto', display: 'inline-flex' }}
            >
              <Unlock size={14} />
              Unlock Parental Lock
            </button>
          </div>
        ) : (
          <div style={contentStyle}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(96, 165, 250, 0.1))',
                border: '1px solid rgba(103, 232, 249, 0.14)',
                marginBottom: '1.4rem',
              }}
            >
              <Unlock size={26} style={{ color: 'rgba(103, 232, 249, 0.9)' }} />
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 0.4rem',
              }}
            >
              Enter Parent Password
            </h2>

            <p
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(148, 163, 184, 0.8)',
                margin: '0 0 1.6rem',
              }}
            >
              Enter the password set during lock activation.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <input
                ref={inputRef}
                type="password"
                className="liquid-glass-input"
                placeholder="Parent lock password"
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="liquid-glass-button">
                <Unlock size={16} />
                Unlock Dashboard
              </button>
            </form>

            <div style={{ marginTop: '1.2rem' }}>
              <button
                className="liquid-glass-link"
                onClick={switchToLocked}
                style={{ margin: '0 auto', display: 'inline-flex' }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            </div>

            <div className="liquid-timer-pill" style={{ margin: '1.2rem auto 0' }}>
              <Clock size={14} />
              <span>{formatTimeLeft(timeLeft)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
