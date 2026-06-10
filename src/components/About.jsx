import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CharReveal from './CharReveal'
import FoamReveal from './FoamReveal'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef  = useRef()
  const photoRef    = useRef()
  const ghostBgRef  = useRef()
  const statRefs    = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // children[0] = ghost bg div (skip), [1] = h3, [2] = grid
      gsap.fromTo(
        Array.from(sectionRef.current.children).slice(1),
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0,
          duration: 0.85, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      )

      // Count-up on numeric stats
      const COUNTS = [2018, 3, null] // null = no count-up (∞)
      statRefs.current.forEach((el, i) => {
        if (!el || COUNTS[i] === null) return
        const target = COUNTS[i]
        const obj = { val: 0 }
        gsap.fromTo(obj,
          { val: 0 },
          {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            delay: i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
            onUpdate() { el.textContent = Math.round(obj.val).toString() },
          }
        )
      })

      // Ghost text parallax
      gsap.fromTo(
        ghostBgRef.current,
        { y: -30 },
        { y: 30, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
      )

      // Subtle parallax on photo gradient
      gsap.fromTo(
        photoRef.current,
        { y: 24 },
        {
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="bg-forest px-12 py-24 relative overflow-hidden scroll-mt-14">
      {/* Foam reveal overlay — mouse traces through cream foam to uncover content */}
      <FoamReveal containerRef={sectionRef} />

      {/* Ghost background text */}
      <div ref={ghostBgRef} className="absolute inset-0 flex items-start justify-end overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span
          className="font-avant font-bold uppercase leading-none"
          style={{
            fontSize: 'clamp(72px, 16vw, 200px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(248,245,230,0.035)',
            letterSpacing: '-0.01em',
            marginTop: '-0.08em',
            marginRight: '-0.04em',
          }}
        >
          STILL
        </span>
      </div>

      <h3 className="text-cream/60">About Still</h3>

      <div className="mt-8 grid grid-cols-2 gap-20 items-start">

        {/* Text column */}
        <div>
          <CharReveal className="font-serif italic text-[clamp(36px,4.5vw,66px)] leading-[1.1] text-cream mb-10">
            A lounge built on slowness.
          </CharReveal>

          <div className="space-y-5 text-cream/50 text-[13px] leading-relaxed font-avant max-w-sm">
            <p>
              Still was born from a single conviction: that coffee deserves
              the same contemplative space as music, as light, as the ritual
              of a Sunday morning that never quite ends.
            </p>
            <p>
              We source directly from small-lot farmers in Ethiopia,
              Colombia and Yemen — people who have cultivated their craft
              for generations, in soils shaped by altitude and time.
            </p>
            <p>
              Each cup is prepared with the patience it deserves:
              hand-poured, precisely dosed, served without rush.
            </p>
            <p className="font-serif italic text-cream/75 text-[15px] pt-2">
              "We don't serve coffee. We offer a moment."
            </p>
          </div>

          {/* Small details row */}
          <div className="mt-12 flex gap-10 border-t border-cream/10 pt-8">
            {[
              { n: '2018', label: 'Founded' },
              { n: '3',    label: 'Origins' },
              { n: '∞',    label: 'Patience' },
            ].map((d, i) => (
              <div key={d.label}>
                <div ref={el => { statRefs.current[i] = el }} className="font-serif italic text-cream text-2xl">{d.n}</div>
                <div className="font-avant text-[10px] tracking-[0.25em] uppercase text-cream/35 mt-1">
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo column */}
        <div className="space-y-3">
          {/* Main "photo" */}
          <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: '4/3' }}>
            <div
              ref={photoRef}
              style={{
                position: 'absolute',
                top: '-12%', bottom: '-12%', left: 0, right: 0,
                background: `
                  linear-gradient(160deg,
                    #243527 0%,
                    #3D5240 35%,
                    #2F4534 60%,
                    #1A2C1C 100%)`,
                willChange: 'transform',
              }}
            />
            {/* Texture overlay — vignette + subtle scan-lines */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 60% 40%, rgba(61,82,64,0.3) 0%, rgba(25,39,25,0.7) 100%)',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 3px)',
              }}
            />
            {/* Ghost watermark text */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <span
                className="font-avant font-bold uppercase select-none"
                style={{
                  fontSize: 'clamp(48px, 8vw, 90px)',
                  letterSpacing: '0.08em',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(248,245,230,0.06)',
                  userSelect: 'none',
                }}
              >
                STILL
              </span>
            </div>
            {/* Coffee ring stains — decorative */}
            <div className="absolute" style={{ width: 52, height: 52, borderRadius: '50%', border: '1.5px solid rgba(248,245,230,0.07)', bottom: 52, right: 52 }} />
            <div className="absolute" style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(248,245,230,0.04)', bottom: 44, right: 60 }} />

            {/* Caption */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <span className="font-serif italic text-cream/30 text-[11px]">
                Still coffee — Paris, 2026
              </span>
              <span
                className="font-avant text-[8px] tracking-[0.25em] uppercase text-cream/18 border border-cream/12 px-2 py-1"
              >
                Lounge
              </span>
            </div>
          </div>

          {/* Small caption card */}
          <div className="flex items-center gap-4 px-1">
            <div className="w-1 h-1 rounded-full bg-orange/60" />
            <p className="font-avant text-[11px] text-cream/35 tracking-[0.05em]">
              Specialty grade only — direct trade sourcing since 2018
            </p>
          </div>

          {/* Secondary editorial row — two small accent photos */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {[
              { label: 'Pour-over ritual', bg: 'linear-gradient(135deg, #1E3020 0%, #2F4534 100%)' },
              { label: 'Origin beans', bg: 'linear-gradient(135deg, #4A2818 0%, #7A3820 100%)' },
            ].map(p => (
              <div key={p.label} className="rounded-lg overflow-hidden relative" style={{ aspectRatio: '4/3' }}>
                <div className="w-full h-full" style={{ background: p.bg }} />
                <div className="absolute inset-0 flex items-end p-2.5">
                  <span className="font-avant text-[8px] tracking-[0.18em] uppercase text-cream/35">
                    {p.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
