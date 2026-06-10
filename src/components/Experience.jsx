import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CharReveal from './CharReveal'

gsap.registerPlugin(ScrollTrigger)

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
  {
    n: '03',
    title: 'Unhurried service',
    desc: 'We do not serve coffee to go. Still is a place to stay, to exhale, to let the cup dictate the pace of your afternoon.',
  },
]

export default function Experience() {
  const sectionRef = useRef()
  const stepsRef   = useRef([])
  const ghostRef   = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-in
      const topChildren = Array.from(sectionRef.current.children).slice(1, 3)
      gsap.fromTo(
        topChildren,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0,
          duration: 0.85, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      )

      // Ghost text parallax
      gsap.fromTo(
        ghostRef.current,
        { y: 40 },
        { y: -40, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
      )

      // Steps — pinned sequential reveal (scrub)
      const valid = stepsRef.current.filter(Boolean)
      // Set initial state
      gsap.set(valid, { opacity: 0, x: -48 })

      const stepTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: '+=480',
          scrub: 1,
        },
      })

      valid.forEach((el, i) => {
        stepTl.to(el, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, i * 0.28)
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="bg-maroon px-12 py-24 relative overflow-hidden scroll-mt-14">
      {/* Ghost background text */}
      <div ref={ghostRef} className="absolute inset-0 flex items-end overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span
          className="font-avant font-bold uppercase leading-none"
          style={{
            fontSize: 'clamp(72px, 16vw, 200px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(195,220,244,0.05)',
            letterSpacing: '-0.01em',
            marginBottom: '-0.12em',
            marginLeft: '-0.02em',
          }}
        >
          RITUAL
        </span>
      </div>

      <h3 className="text-sky">Experience</h3>

      <div className="mt-8 grid grid-cols-2 gap-16 items-end">
        <CharReveal className="font-serif italic text-[clamp(42px,5vw,76px)] leading-[1.05] text-sky">
          A single cup
        </CharReveal>
        <p className="text-sky/55 text-sm leading-relaxed font-avant pb-2">
          The ritual of stillness. Each cup at Still is a meditation —
          hand-poured, precisely dosed, served without rush.
          The water temperature, the grind, the bloom:
          every variable tuned to the origin.
        </p>
      </div>

      <div className="mt-14 border-t border-sky/15">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            ref={el => { stepsRef.current[i] = el }}
            className="relative flex items-center gap-10 py-7 border-b border-sky/15
                       group cursor-default select-none"
          >
            {/* Hover indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sky
                            origin-top scale-y-0 group-hover:scale-y-100
                            transition-transform duration-300" />
            <span className="text-xs text-sky/30 font-avant tabular-nums w-5 shrink-0
                             group-hover:text-sky group-hover:scale-110
                             transition-all duration-300">
              {s.n}
            </span>
            <span
              className="font-avant font-semibold uppercase tracking-[0.22em] text-[11px]
                         text-sky/65 group-hover:text-sky transition-colors duration-300 w-36 shrink-0"
            >
              {s.title}
            </span>
            <span className="text-sm text-sky/40 font-avant leading-snug">{s.desc}</span>
          </div>
        ))}
      </div>

    </section>
  )
}
