export function ContactSection() {
  return (
    <section id="contact" className="px-4 pb-24 pt-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-[2rem] p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Contact</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-white">Reach MC Mathematics</h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                For enrollment, class clarifications, or institute updates, students and parents can use the direct
                lines below.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ['Phone', '0712827519'],
                ['WhatsApp', '0712382728'],
                ['Email', 'malingacdissanayake@gmail.com'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.6rem] border border-white/8 bg-slate-950/45 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-3 break-words font-display text-xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
