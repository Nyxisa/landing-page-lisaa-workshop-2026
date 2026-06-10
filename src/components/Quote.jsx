import { useRef, useLayoutEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const QUOTE_TEXT = 'The best cup of coffee is the one drunk in silence, in the presence of your inner peace.'

function CharSpans({ text }) {
  return useMemo(() => (
    <>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="char"
          style={{ opacity: 0.08 }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  ), [text])
}

export default function Quote() {
  const sectionRef = useRef()
  const quoteRef   = useRef()
  const decoRef    = useRef()
  const labelRef   = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Label entrance
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      // Decorative element entrance
      gsap.fromTo(decoRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      )

      // Character-by-character fill — tied to scroll progress through section
      const chars = quoteRef.current?.querySelectorAll('.char')
      if (chars?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            end: 'bottom 55%',
            scrub: 1.4,
          },
        })

        tl.to(chars, {
          opacity: 1,
          stagger: { each: 0.025, ease: 'none' },
          ease: 'none',
          duration: 1,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-sky px-12 py-24 flex items-center gap-20 relative overflow-hidden">

      {/* Decorative large quote mark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: -20, left: 32,
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(180px, 22vw, 320px)',
          lineHeight: 1,
          color: 'rgba(37,67,43,0.05)',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        "
      </div>

      {/* Quote column */}
      <div className="flex-1 max-w-2xl relative">
        <h3 ref={labelRef} className="text-forest/38 mb-8" style={{ opacity: 0 }}>
          The philosophy
        </h3>

        <blockquote
          ref={quoteRef}
          className="font-serif italic text-forest
                     text-[clamp(26px,3.4vw,52px)] leading-[1.25]"
        >
          <CharSpans text={QUOTE_TEXT} />
          <footer className="mt-6 font-avant font-bold text-[10px] tracking-[0.3em]
                             uppercase text-forest/45 not-italic opacity-0"
                  ref={el => {
                    // Fade in footer separately after chars
                    if (el) gsap.fromTo(el, { opacity: 0 }, {
                      opacity: 1, duration: 0.6,
                      scrollTrigger: { trigger: el, start: 'top 75%' },
                    })
                  }}>
            — Still Coffee, Paris
          </footer>
        </blockquote>
      </div>

      {/* Abstract still-life */}
      <div ref={decoRef} className="relative flex-shrink-0 w-72 h-64" style={{ opacity: 0 }}>
        {[
          { rot: -9,  tx: -10, ty: 15 },
          { rot:  2,  tx:  20, ty: 5  },
          { rot: 11,  tx:  52, ty: 20 },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute bg-cream/75 rounded shadow-md quote-card-${i}`}
            style={{ width: 130, height: 164, left: 20, top: 0 }}
          />
        ))}
        {[
          { size: 88, left: 110, top: 62  },
          { size: 68, left: 164, top: 102 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-maroon"
            style={{ width: c.size, height: c.size, left: c.left, top: c.top }}
          />
        ))}
      </div>

    </section>
  )
}
