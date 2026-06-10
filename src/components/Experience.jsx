const STEPS = [
  {
    n: '01',
    title: 'Hand-poured',
    desc: 'Every cup prepared with patience. Never rushed, never automated — the water temperature and bloom timed by hand.',
  },
  {
    n: '02',
    title: 'Origin-driven',
    desc: 'Each roast sourced directly from small-lot farmers in soils shaped by altitude, time, and generations of craft.',
  },
]

export default function Experience() {
  return (
    <section className="bg-forest px-12 py-24">

      <span className="text-[11px] font-avant tracking-[0.45em] uppercase text-orange">
        Experience
      </span>

      {/* Heading row */}
      <div className="mt-8 grid grid-cols-2 gap-16 items-end">
        <h2 className="font-serif italic text-[clamp(42px,5vw,76px)] leading-[1.05] text-cream">
          A single cup
        </h2>
        <p className="text-cream/50 text-sm leading-relaxed font-avant pb-2">
          The ritual of stillness. Each cup at Still is a meditation —
          hand-poured, precisely dosed, served without rush.
          The water temperature, the grind, the bloom:
          every variable tuned to the origin.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-14 border-t border-cream/10">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="flex items-center gap-10 py-7 border-b border-cream/10
                       group cursor-default select-none"
          >
            <span className="text-xs text-cream/25 font-avant tabular-nums w-5">{s.n}</span>
            <span
              className="font-avant font-semibold uppercase tracking-[0.22em] text-[11px]
                         text-cream/70 group-hover:text-orange transition-colors duration-300 w-36"
            >
              {s.title}
            </span>
            <span className="text-sm text-cream/40 font-avant leading-snug">{s.desc}</span>
          </div>
        ))}
      </div>

    </section>
  )
}
