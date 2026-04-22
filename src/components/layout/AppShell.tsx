import type { PropsWithChildren } from 'react'
import { MathBackground } from '../visuals/MathBackground'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="bg-noise relative min-h-screen overflow-hidden">
      <MathBackground />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}
