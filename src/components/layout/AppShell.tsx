import type { PropsWithChildren } from 'react'
import { MathBackground } from '../visuals/MathBackground'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="bg-noise relative min-h-screen overflow-hidden">
      <MathBackground />
      <div className="floating-blob left-[-8rem] top-16 h-72 w-72 bg-cyan-400/40" />
      <div className="floating-blob right-[-8rem] top-1/3 h-96 w-96 bg-violet-500/30" />
      <div className="floating-blob bottom-[-10rem] left-1/3 h-80 w-80 bg-blue-400/24" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}
