import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Sticker from './Sticker'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    region: 'Colombia', origin: 'Huila', altitude: '1,600 – 2,100 m',
    harvest: 'Harvest: Mar – Jun', notes: 'Dark chocolate · citrus · full body',
    bg: 'var(--color-maroon)', text: 'var(--color-cream)',
    gradient: 'linear-gradient(to top, rgba(122,30,30,1) 0%, rgba(122,30,30,0) 100%)',
    rot: -7, dy: 18, sc: 1, zIndex: 10,
    img: '/img/texture-mousse-brown.webp',
  },
  {
    region: 'Ethiopia', origin: 'Yirgacheffe', altitude: '1,800 – 2,200 m',
    harvest: 'Harvest: Nov – Jan', notes: 'Jasmine · blueberry · floral clarity',
    bg: 'var(--color-orange)', text: 'var(--color-cream)',
    gradient: 'linear-gradient(to top, rgba(229,80,26,1) 0%, rgba(229,80,26,0) 100%)',
    rot: -1.5, dy: -8, sc: 1.05, zIndex: 20, featured: true,
    img: '/img/texture-mousse-white.webp',
  },
  {
    region: 'Japan', origin: 'Uji, Kyoto', altitude: '100 – 350 m',
    harvest: 'Harvest: Apr – May', notes: 'Umami · sweet grass · creamy finish',
    bg: 'var(--color-forest)', text: 'var(--color-cream)',
    gradient: 'linear-gradient(to top, rgba(37,67,43,1) 0%, rgba(37,67,43,0) 100%)',
    rot: 5, dy: 12, sc: 1, zIndex: 10,
    img: '/img/texture-matcha.webp',
    matcha: true,
  },
]

function Card({ card, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="coffee-card group relative rounded-lg cursor-pointer shrink-0 overflow-hidden"
      style={{
        width: 210, height: 292,
        backgroundColor: card.bg,
        zIndex: card.zIndex,
        willChange: 'transform',
        boxShadow: card.featured ? '0 0 48px rgba(229,80,26,0.22)' : undefined,
      }}
    >
      {/* Texture image */}
      <div
        className="mx-3 mt-3 rounded-lg overflow-hidden relative"
        style={{ height: 178 }}
      >
        <img src={card.img} alt="" className="w-full h-full object-cover" draggable={false} />
        {/* Tasting notes overlay — sur l'image */}
        <div
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          style={{ background: card.gradient, padding: '28px 12px 10px' }}
        >
          <p className="caption-serif leading-snug text-cream/85">{card.notes}</p>
        </div>
        {/* Featured / Matcha badge */}
        {(card.featured || card.matcha) && (
          <div
            className={`absolute top-2.5 right-2.5 label px-1.75 py-0.5 rounded-full ${
              card.matcha
                ? 'text-forest bg-cream'
                : 'text-orange bg-cream'
            }`}
          >
            {card.matcha ? 'Matcha' : 'Signature'}
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="px-4 pt-3" style={{ color: card.text }}>
        <div className="label opacity-60">
          {card.matcha ? 'Ceremonial grade' : card.origin}
        </div>
        <div className="font-avant font-bold text-[15px] mt-0.5">{card.region}</div>
        <div className="body-text-s mt-2 opacity-50">Altitude {card.altitude}</div>
        <div className="body-text-s opacity-40">{card.harvest}</div>
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


  return (
    <section ref={sectionRef} id="coffees" className="bg-charcoal relative overflow-hidden scroll-mt-14">
      <div className="container py-24">
      <h3 ref={labelRef} className="text-cream/60">
        Coffees
      </h3>

      <div ref={headerRef} className="mt-4 flex items-end justify-between">
        <h2
          className="text-cream max-w-sm text-nowrap"
        >
          The collection.
        </h2>
        <p className="body-text-s text-cream/38 max-w-xs text-right pb-1">
          Three origins, one standard of excellence.<br />
          Each harvest tracked from soil to cup.
        </p>
      </div>

      <div ref={containerRef} className="relative mt-16 flex justify-center items-center gap-5">
        <Sticker
          src="/img/texture-glass.webp"
          style={{ top: '8%', right: '4%' }}
          initRotation={-14}
          size={256}
          delay={0.25}
        />
        <Sticker
          src="/img/texture-tiles-green.webp"
          style={{ bottom: '6%', left: '3%' }}
          initRotation={9}
          size={220}
          delay={0.5}
        />
        {CARDS.map((card, i) => (
          <Card
            key={i}
            card={card}
            cardRef={el => { cardRefs.current[i] = el }}
          />
        ))}
      </div>

      </div>
    </section>
  )
}
