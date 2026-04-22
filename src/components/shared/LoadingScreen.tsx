interface LoadingScreenProps {
  message: string
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel accent-border w-full max-w-md rounded-[2rem] p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-2 border-cyan-300/20 border-t-cyan-300 animate-spin" />
        <h2 className="font-display mt-6 text-2xl font-semibold text-white">MC Mathematics</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>
      </div>
    </div>
  )
}
