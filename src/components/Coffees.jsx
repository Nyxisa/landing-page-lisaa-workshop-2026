import { useRef, useLayoutEffect, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    region: 'Colombia', origin: 'Huila', altitude: '1,600 – 2,100 m',
    harvest: 'Harvest: Mar – Jun', notes: 'Dark chocolate · citrus · full body',
    bg: '#7A1E1E', text: '#F2EDE3',
    rot: -7, dy: 18, sc: 1, zIndex: 10,
    imgGradient: 'linear-gradient(155deg, #5C1515 0%, #8A2420 55%, #3E0C0C 100%)',
    ghost: 'HUILA',
  },
  {
    region: 'Ethiopia', origin: 'Yirgacheffe', altitude: '1,800 – 2,200 m',
    harvest: 'Harvest: Nov – Jan', notes: 'Jasmine · blueberry · floral clarity',
    bg: '#E5501A', text: '#F2EDE3',
    rot: -1.5, dy: -8, sc: 1.05, zIndex: 20, featured: true,
    imgGradient: 'linear-gradient(155deg, #B83C0E 0%, #E5601A 55%, #8C2C08 100%)',
    ghost: 'YIRGACHEFFE',
  },
  {
    region: 'Yemen', origin: 'Mocha', altitude: '1,500 – 2,000 m',
    harvest: 'Harvest: Oct – Dec', notes: 'Wild fruit · aged terroir · spice',
    bg: '#C3DCF4', text: '#25432B',
    rot: 5, dy: 12, sc: 1, zIndex: 10,
    imgGradient: 'linear-gradient(155deg, #A0C8E8 0%, #C8DFF5 55%, #7AAACE 100%)',
    ghost: 'MOCHA',
  },
]

function Card({ card, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="coffee-card group relative rounded-xl cursor-pointer shrink-0 overflow-hidden"
      style={{
        width: 210, height: 292,
        backgroundColor: card.bg,
        zIndex: card.zIndex,
        willChange: 'transform',
        boxShadow: card.featured ? '0 0 48px rgba(229,80,26,0.22)' : undefined,
      }}
    >
      {/* Image placeholder with texture gradient + ghost watermark */}
      <div
        className="mx-3 mt-3 rounded-lg overflow-hidden relative"
        style={{ height: 178 }}
      >
        <div className="w-full h-full" style={{ background: card.imgGradient }} />
        {/* Ghost region label */}
        <div
          className="absolute inset-0 flex items-end justify-start px-3 pb-2"
          style={{ pointerEvents: 'none' }}
        >
          <span
            className="font-avant font-bold uppercase select-none"
            style={{
              fontSize: 28,
              letterSpacing: '0.05em',
              color: 'transparent',
              WebkitTextStroke: `1px rgba(242,237,227,0.14)`,
              lineHeight: 1,
            }}
          >
            {card.ghost}
          </span>
        </div>
        {/* Featured badge */}
        {card.featured && (
          <div
            className="absolute top-2.5 right-2.5 font-avant font-bold
                       text-[8px] tracking-[0.25em] uppercase"
            style={{
              border: '1px solid rgba(242,237,227,0.4)',
              padding: '2px 7px',
              color: 'rgba(242,237,227,0.7)',
            }}
          >
            Signature
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="px-4 pt-3" style={{ color: card.text }}>
        <div className="text-[10px] font-avant tracking-[0.3em] uppercase opacity-60">
          {card.origin}
        </div>
        <div className="font-avant font-bold text-[15px] mt-0.5">{card.region}</div>
        <div className="text-[11px] mt-2 opacity-50">Altitude {card.altitude}</div>
        <div className="text-[11px] opacity-40">{card.harvest}</div>
      </div>

      {/* Tasting notes — revealed on hover */}
      <div
        className="absolute bottom-0 left-0 right-0
                   translate-y-full group-hover:translate-y-0
                   transition-transform duration-300 ease-out"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)`,
          padding: '24px 16px 14px',
        }}
      >
        <p className="font-serif italic text-[10px] leading-snug"
           style={{ color: 'rgba(242,237,227,0.82)' }}>
          {card.notes}
        </p>
      </div>
    </div>
  )
}

export default function Coffees() {
  const sectionRef   = useRef()
  const labelRef     = useRef()
  const headerRef    = useRef()
  const containerRef = useRef()
  const cardRefs     = useRef([])
  const spotRef      = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Section header fades in
      gsap.fromTo(
        [labelRef.current, headerRef.current],
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.78, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      // Pinned cards drop-in — cinematic scrub
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: '+=520',
          scrub: 1.2,
          pin: false,
        },
      })

      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const c = CARDS[i]
        pinTl.fromTo(
          el,
          { rotation: c.rot, y: c.dy - 220, scale: c.sc * 0.9, opacity: 0 },
          { rotation: c.rot, y: c.dy, scale: c.sc, opacity: 1, ease: 'back.out(1.2)', duration: 0.5 },
          i * 0.15
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Mouse-follow spotlight
  useEffect(() => {
    const section = sectionRef.current
    const spot    = spotRef.current
    if (!section || !spot) return

    let tx = 50, ty = 72, cx = 50, cy = 72, rafId

    const update = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      spot.style.background = `radial-gradient(ellipse 60% 50% at ${cx}% ${cy}%, rgba(229,80,26,0.11) 0%, transparent 65%)`
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width  * 100
      ty = (e.clientY - rect.top)  / rect.height * 100
    }

    section.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      section.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} id="coffees" className="bg-charcoal px-12 py-24 relative overflow-hidden scroll-mt-14">
      {/* Dynamic mouse-follow spotlight */}
      <div
        ref={spotRef}
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 72%, rgba(229,80,26,0.11) 0%, transparent 65%)',
        }}
      />

      <h2 ref={labelRef} className="text-sm font-avant font-bold tracking-[0.2em] uppercase text-cream/50">
        Coffees
      </h2>

      <div ref={headerRef} className="mt-4 flex items-end justify-between">
        <p
          className="font-serif italic text-[clamp(28px,3.5vw,54px)] leading-[1.1] text-cream max-w-sm still-ghost"
          data-text="The collection."
        >
          The collection.
        </p>
        <p className="text-cream/38 text-[12px] font-avant leading-relaxed max-w-xs text-right pb-1">
          Three origins, one standard of excellence.<br />
          Each harvest tracked from soil to cup.
        </p>
      </div>

      <div ref={containerRef} className="relative mt-16 flex justify-center items-center gap-5">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 750 320"
          preserveAspectRatio="none"
        >
          <path
            d="M 130 200 C 260 120, 490 240, 620 175"
            fill="none"
            stroke="#F2EDE3"
            strokeWidth="1"
            strokeOpacity="0.12"
            strokeDasharray="5 7"
          />
        </svg>

        {CARDS.map((card, i) => (
          <Card
            key={i}
            card={card}
            cardRef={el => { cardRefs.current[i] = el }}
          />
        ))}
      </div>

    </section>
  )
}
