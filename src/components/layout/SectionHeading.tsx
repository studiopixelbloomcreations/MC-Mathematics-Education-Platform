interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.38em] text-cyan-300/80">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>
    </div>
  )
}
