import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Globe3D from './Globe3D'
import './Origins.css'

gsap.registerPlugin(ScrollTrigger)

const PINS = [
  {
    name: 'Colombia', region: 'Huila', altitude: '1,600 – 2,100 m',
    harvest: 'Mar – Jun', note: 'Dark chocolate, full body, citrus finish',
  },
  {
    name: 'Ethiopia', region: 'Yirgacheffe', altitude: '1,800 – 2,200 m',
    harvest: 'Nov – Jan', note: 'Jasmine, blueberry, floral clarity',
  },
  {
    name: 'Yemen', region: 'Mocha', altitude: '1,500 – 2,000 m',
    harvest: 'Oct – Dec', note: 'Wild fermented fruit, ancient terroir',
  },
]

function StampCard({ pin }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        bottom: -8, left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '8px solid rgba(248,245,230,0.92)',
      }} />
      <div style={{
        width: 164,
        background: '#F8F5E6',
        color: '#25432B',
        padding: '13px 14px',
        lineHeight: 1.5,
        boxShadow: '4px 10px 28px rgba(0,0,0,0.55)',
        outline: '2px dashed rgba(37,67,43,0.18)',
        outlineOffset: '4px',
        fontFamily: 'var(--font-avant)',
      }}>
        <div style={{ fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.42 }}>
          Origin
        </div>
        <div style={{ fontWeight: 700, marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12 }}>
          {pin.name}
        </div>
        <div style={{ opacity: 0.55, fontSize: 10, marginTop: 2 }}>{pin.region}</div>
        <div style={{ marginTop: 9, borderTop: '1px solid rgba(37,67,43,0.1)', paddingTop: 8 }}>
          <div style={{ opacity: 0.48, fontSize: 10 }}>{pin.altitude}</div>
          <div style={{ opacity: 0.42, fontSize: 10 }}>{pin.harvest}</div>
          <div style={{ fontStyle: 'italic', marginTop: 6, opacity: 0.78, fontSize: 10 }}>
            {pin.note}
          </div>
        </div>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 34, height: 34, borderRadius: '50%',
          border: '1.5px solid rgba(229,80,26,0.48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(-18deg)',
        }}>
          <span style={{ fontSize: 5.5, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(229,80,26,0.62)', fontWeight: 700 }}>
            STILL
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Origins() {
  const sectionRef  = useRef()
  const labelRef    = useRef()
  const subtitleRef = useRef()
  const stampRefs   = useRef([])
  const statsRef    = useRef()
  const globeRotRef = useRef(0) // driven by scroll progress

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Single ScrollTrigger drives pin + timeline + globe rotation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2400',
          pin: true,
          anticipatePin: 1,
          scrub: 1.4,
          onUpdate: (self) => {
            globeRotRef.current = self.progress * Math.PI * 4
          },
        },
      })

      // Header reveals early
      tl.fromTo(
        [labelRef.current, subtitleRef.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out', duration: 0.15 },
        0
      )

      // Stamps arrive from right, stacked on an invisible skewer
      stampRefs.current.forEach((el, i) => {
        if (!el) return
        tl.fromTo(
          el,
          { x: 380, opacity: 0, rotation: 12 - i * 4, transformOrigin: 'center center' },
          { x: 0, opacity: 1, rotation: 0, ease: 'power3.out', duration: 0.3 },
          0.2 + i * 0.25
        )
      })

      // Stats appear at the end
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.15 },
        0.88
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="origins"
      className="bg-charcoal scroll-mt-14 relative"
      style={{ height: '100vh' }}
    >
      <div className="h-full flex flex-col px-12 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-6 shrink-0">
          <div>
            <h3 ref={labelRef} className="text-[11px] font-avant tracking-[0.45em] uppercase text-sky opacity-0">
              Origins
            </h3>
            <p ref={subtitleRef} className="mt-2 text-cream/35 text-[12px] font-avant tracking-[0.05em] opacity-0">
              Three origins. Three terroirs. One cup.
            </p>
          </div>
          <p className="text-cream/22 text-[11px] font-avant tracking-[0.1em] text-right">
            Direct trade · Small-lot · Traceable
          </p>
        </div>

        {/* Main — globe left, stamps right */}
        <div className="flex-1 flex gap-10 items-center min-h-0 overflow-hidden">

          {/* Globe */}
          <div style={{ flex: 1, height: '100%', minHeight: 0 }}>
            <Globe3D rotRef={globeRotRef} />
          </div>

          {/* Stamps column */}
          <div className="shrink-0 flex flex-col gap-5" style={{ width: 184 }}>
            {PINS.map((pin, i) => (
              <div
                key={pin.name}
                ref={el => { stampRefs.current[i] = el }}
                style={{ opacity: 0, willChange: 'transform, opacity' }}
              >
                <StampCard pin={pin} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="shrink-0 flex items-center justify-center gap-14 border-t border-cream/8 pt-5 mt-4 opacity-0"
        >
          {[
            { n: '3',    label: 'Continents' },
            { n: '12',   label: 'Single lots' },
            { n: '100%', label: 'Direct trade' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-serif italic text-sky text-xl">{stat.n}</div>
              <div className="font-avant text-[9px] tracking-[0.28em] uppercase text-cream/30 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
