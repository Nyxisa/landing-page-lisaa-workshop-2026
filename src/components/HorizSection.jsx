import { useRef, useLayoutEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Globe3D from './Globe3D'
import './Origins.css'

gsap.registerPlugin(ScrollTrigger)

const QUOTE_TEXT =
  'The best cup of coffee is the one drunk in silence, in the presence of your inner peace.'

const ORIGINS_PINS = [
  {
    name: 'Colombia', region: 'Huila', altitude: '1,600 – 2,100 m',
    harvest: 'Mar – Jun', note: 'Dark chocolate, full body, citrus finish',
  },
  {
    name: 'Ethiopia', region: 'Yirgacheffe', altitude: '1,800 – 2,200 m',
    harvest: 'Nov – Jan', note: 'Jasmine, blueberry, floral clarity',
  },
  {
    name: 'Japan', region: 'Uji, Kyoto', altitude: '50 – 300 m',
    harvest: 'Apr – May', note: 'Ceremonial matcha, umami depth, spring vegetal',
  },
]

const TIMBRE_START = [47, -51, 45, -71, 52]
const TIMBRE_END   = [-13, 9, -15, 11, -8]

const BG_DECOS = [
  { src: '/img/stamp-3.webp',  w: 90,  pos: { top: '32%',    left: '32%'   }, rot: -8,  opacity: 0.21, delay: 5.0 },
  { src: '/img/letter-4.webp', w: 240, pos: { bottom: '30%',  right: '30%'  }, rot: 22,  opacity: 0.17, delay: 5.3 },
  { src: '/img/letter-5.webp', w: 180, pos: { top: '40%',     right: '30%' }, rot: -17, opacity: 0.14, delay: 5.6 },
  { src: '/img/letter-6.webp', w: 280, pos: { bottom: '16%', left: '30%'  }, rot: 8,   opacity: 0.23, delay: 5.9 },
]

function CharSpans({ text }) {
  return useMemo(() => (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} className="char" style={{ opacity: 0.08 }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  ), [text])
}

function StampCard({ pin }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: 164, background: '#F8F5E6', color: '#25432B',
        padding: '13px 14px', lineHeight: 1.5, position: 'relative',
        borderRadius: 8,
        filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.1)) drop-shadow(4px 8px 16px rgba(0,0,0,0.04))',
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
          position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%',
          border: '1.5px solid rgba(229,80,26,0.48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(-18deg)',
        }}>
          <img src="/logo-stamp.svg" alt="Still" style={{ width: 18, height: 18, opacity: 0.62 }} />
        </div>
      </div>
    </div>
  )
}

export default function HorizSection() {
  /* ── refs ──────────────────────────────────────────────────────────────
     wrapRef  → conteneur externe : pin trigger + bg-sky (jamais transformé)
     innerRef → conteneur interne : reçoit uniquement l'animation de zoom
     trackRef → track 200vw qui défile horizontalement
  ─────────────────────────────────────────────────────────────────────── */
  const wrapRef  = useRef()
  const innerRef = useRef()
  const trackRef = useRef()

  const labelRef   = useRef()
  const footerRef  = useRef()
  const globeRotRef = useRef(0)

  const timbreRefs      = useRef([null, null, null, null, null])
  const origLabelRef    = useRef()
  const origSubtitleRef = useRef()
  const origStampRefs   = useRef([null, null, null])
  const origStatsRef    = useRef()
  const bgDecoRefs      = useRef([null, null, null, null])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      /* Init bg deco rotations before any animation */
      bgDecoRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { rotation: BG_DECOS[i].rot })
      })

      /* ── 1. Zoom à l'entrée : seul innerRef est mis à l'échelle ──── */
      gsap.fromTo(
        innerRef.current,
        { scale: 0.88, borderRadius: '28px' },
        {
          scale: 1, borderRadius: '0px',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 85%',
            end: 'top top',
            scrub: 1.2,
          },
        }
      )

      /* ── 2. Pin + timeline horizontale (trigger = wrapRef) ──────────
         10 unités × 440 px = 4 400 px de scroll pinné
         À 5.0 u (50 %) le pan est fini → Origins visible
      ─────────────────────────────────────────────────────────────── */
      const GLOBE_START = 0.5

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '+=4400',
          pin: true,
          anticipatePin: 1,
          scrub: 1.4,
          onUpdate(self) {
            if (self.progress > GLOBE_START) {
              globeRotRef.current =
                ((self.progress - GLOBE_START) / (1 - GLOBE_START)) * Math.PI * 4
            }
          },
        },
      })

      // [0] Label
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0
      )

      // [0 → ~2.56] Chars
      const chars = trackRef.current?.querySelectorAll('.char')
      if (chars?.length) {
        tl.to(
          chars,
          { opacity: 1, stagger: { each: 0.028, ease: 'none' }, ease: 'none', duration: 0.1 },
          0
        )
      }

      // [0.5 → 3.4] Timbres scrubés, rotation départ → inverse
      timbreRefs.current.forEach((el, i) => {
        if (!el) return
        tl.fromTo(
          el,
          { x: () => window.innerWidth + 200 + i * 80, opacity: 0, rotation: TIMBRE_START[i] },
          { x: 0, opacity: 1, rotation: TIMBRE_END[i], ease: 'none', duration: 0.9 },
          0.5 + i * 0.5
        )
      })

      // [3.1] Signature
      tl.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 3.1)

      // [3.7 → 5.0] Pan horizontal
      tl.to(
        trackRef.current,
        { x: () => -window.innerWidth, ease: 'none', duration: 1.3 },
        3.7
      )

      // [5.0] Header Origins
      tl.fromTo(
        [origLabelRef.current, origSubtitleRef.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out', duration: 0.8 },
        5.0
      )

      // [5.1 / 5.7 / 6.3] Stamp cards — déclenchement plus tôt, stagger réduit
      origStampRefs.current.forEach((el, i) => {
        if (!el) return
        tl.fromTo(
          el,
          { x: 380, opacity: 0, rotation: 12 - i * 4 },
          { x: 0, opacity: 1, rotation: 0, ease: 'power3.out', duration: 0.8 },
          5.1 + i * 0.6
        )
      })

      // [5.0] Stats — avec le header Origins
      tl.fromTo(
        origStatsRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, ease: 'power2.out', duration: 0.8 },
        5.0
      )

      // [5.0 → 5.9] Background decorations — staggered fade-in
      bgDecoRefs.current.forEach((el, i) => {
        if (!el) return
        tl.fromTo(
          el,
          { opacity: 0 },
          { opacity: BG_DECOS[i].opacity, ease: 'power2.out', duration: 0.8 },
          BG_DECOS[i].delay
        )
      })

    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    /* wrapRef — 100vh fixe, transparent (pipes visibles), jamais transformé, sert de conteneur pin */
    <div
      ref={wrapRef}
      className="overflow-hidden z-20"
      style={{ height: '100vh' }}
    >
      {/* innerRef — seul élément à recevoir le scale du zoom */}
      <div
        ref={innerRef}
        className="overflow-hidden"
        style={{ height: '100%', transformOrigin: 'center center', willChange: 'transform' }}
      >
        {/* Track 200vw */}
        <div
          ref={trackRef}
          style={{ display: 'flex', width: '200vw', height: '100%', willChange: 'transform' }}
        >

          {/* ══ PANNEAU 1 — QUOTE ══════════════════════════════════════ */}
          <div
            className="flex-shrink-0 bg-sky relative flex items-center justify-center overflow-hidden"
            style={{ width: '100vw', height: '100vh', paddingTop: '5rem' }}
          >
            <div
              aria-hidden="true"
              className="absolute pointer-events-none select-none"
              style={{
                top: -20, left: 32,
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(180px, 22vw, 320px)',
                lineHeight: 1,
                color: 'rgba(37,67,43,0.05)',
              }}
            >"</div>

            {/* Container centré */}
            <div className="container flex items-center h-full w-full">

            {/* Colonne texte */}
            <div
              className="relative z-10 shrink-0"
              style={{ width: '55%', paddingRight: '4rem' }}
            >
              <h3
                ref={labelRef}
                className="text-maroon/60 mb-8"
                style={{ opacity: 0 }}
              >
                Philosophy
              </h3>
              <blockquote
                className="font-serif italic text-maroon"
                style={{
                  fontSize: 'clamp(26px, 3.4vw, 52px)',
                  lineHeight: 1.25,
                  maxWidth: '52ch',
                  whiteSpace: 'normal',
                }}
              >
                <CharSpans text={QUOTE_TEXT} />
                <footer
                  ref={footerRef}
                  className="mt-6 text-charcoal/45"
                  style={{ opacity: 0, display: 'block' }}
                >
                  <h4>— Still Coffee, Paris to Mexico</h4>
                                  </footer>
              </blockquote>
            </div>

            {/* Colonne timbres */}
            <div
              className="relative flex-1"
              style={{ height: '100%' }}
            >
              {[
                { src: '/img/letter-1.webp', w: 360, left: '8%', top: '28%' },
                { src: '/img/letter-2.webp', w: 460, left: '36%', top: '32%' },
                { src: '/img/letter-3.webp', w: 220, left: '40%', top: '8%' },
              ].map((s, i) => (
                <img
                  key={`r${i}`}
                  ref={el => { timbreRefs.current[i] = el }}
                  src={s.src}
                  alt=""
                  className="absolute"
                  style={{
                    width: s.w, height: 'auto', left: s.left, top: s.top,
                    opacity: 0,
                    filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3)) drop-shadow(4px 8px 16px rgba(0,0,0,0.1))',
                  }}
                />
              ))}
              {[
                { src: '/img/stamp-1.webp', w: 110, left: '26%', top: '54%' },
                { src: '/img/stamp-2.webp', w: 140, left: '60%', top: '58%' },
              ].map((c, i) => (
                <img
                  key={`c${i}`}
                  ref={el => { timbreRefs.current[3 + i] = el }}
                  src={c.src}
                  alt=""
                  className="absolute"
                  style={{
                    width: c.w, height: 'auto', left: c.left, top: c.top,
                    opacity: 0,
                    filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3)) drop-shadow(4px 8px 16px rgba(0,0,0,0.2))',
                  }}
                />
              ))}
            </div>
            </div>{/* end container Quote */}
          </div>

          {/* ══ PANNEAU 2 — ORIGINS ════════════════════════════════════ */}
          <div
            className="shrink-0 bg-sand relative"
            id="origins"
            style={{ width: '100vw', height: '100vh' }}
          >
            {/* Background decorative images */}
            {BG_DECOS.map((d, i) => (
              <img
                key={`bg${i}`}
                ref={el => { bgDecoRefs.current[i] = el }}
                src={d.src}
                alt=""
                draggable={false}
                style={{
                  position: 'absolute', width: d.w, height: 'auto',
                  ...d.pos,
                  opacity: 0, zIndex: 0,
                  pointerEvents: 'none', userSelect: 'none',
                }}
              />
            ))}
            <div
              className="container flex flex-col pb-16 h-full"
              style={{ paddingTop: '8rem' }}
            >
              {/* Header */}
              <div className="flex gap-4 mb-6 flex-col shrink-0">
                <div>
                  <h3
                    ref={origLabelRef}
                    className="text-orange/60"
                    style={{ opacity: 0 }}
                  >
                    Origins
                  </h3>
                  <h2
                    ref={origSubtitleRef}
                    className="mt-2 text-orange"
                    style={{ opacity: 0 }}
                  >
                    Three origins in a single place.
                  </h2>
                </div>
                <p className="body-text-s text-charcoal/40">
                  Direct trade · Small-lot · Traceable
                </p>
              </div>

              {/* 3 colonnes : stats | globe | cards */}
              <div className="flex-1 flex gap-8 items-center min-h-0">

                {/* Colonne gauche — chiffres */}
                <div
                  ref={origStatsRef}
                  className="shrink-0 flex flex-col justify-center gap-10 border-r border-charcoal/15 pr-8"
                  style={{ width: 140, opacity: 0 }}
                >
                  {[
                    { n: '3',    label: 'Continents' },
                    { n: '12',   label: 'Single lots' },
                    { n: '100%', label: 'Direct trade' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="stats-number text-orange">{stat.n}</div>
                      <div className="label text-charcoal/45 mt-2">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Globe — centre */}
                <div style={{ flex: 1, height: '100%', minHeight: 0, overflow: 'visible' }}>
                  <Globe3D rotRef={globeRotRef} />
                </div>

                {/* Colonne droite — cards origins */}
                <div className="shrink-0 flex flex-col gap-5" style={{ width: 184 }}>
                  {ORIGINS_PINS.map((pin, i) => (
                    <div
                      key={pin.name}
                      ref={el => { origStampRefs.current[i] = el }}
                      style={{ opacity: 0, willChange: 'transform, opacity' }}
                    >
                      <StampCard pin={pin} />
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
