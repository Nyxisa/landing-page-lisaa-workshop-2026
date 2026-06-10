import { useRef, useEffect } from 'react'

// Speed: 0 = fixed in viewport | 1 = scrolls normally | negative = faster than scroll
const LAYERS = [
  { src: '/Coffee-beans-3.webp', speed: 0.60, zIndex: 5  }, // far bg  — monte à 40% vitesse
  { src: '/Coffee-beans-2.webp', speed: 0.40, zIndex: 6  }, // mid bg  — monte à 60% vitesse
  { src: '/Coffee-beans-1.webp', speed: 0.15, zIndex: 20 }, // devant  — monte à 85% vitesse
]
const LOGO_SPEED = -0.4  // logo monte à 140% vitesse → s'échappe vers le haut en premier

const BAR_COUNT = 4

export default function Hero() {
  const refs    = useRef([])
  const logoRef = useRef()
  const barRefs = useRef([])  // les 4 éléments de remplissage

  useEffect(() => {
    const onScroll = () => {
      const y        = window.scrollY
      const progress = Math.min(1, y / window.innerHeight) // 0→1 pendant la hero

      // parallax images + logo
      refs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${y * LAYERS[i].speed}px)`
      })
      if (logoRef.current)
        logoRef.current.style.transform = `translateY(${y * LOGO_SPEED}px)`

      // remplissage des barres : chaque barre couvre 1/4 du scroll
      barRefs.current.forEach((el, i) => {
        if (!el) return
        const fill = Math.min(1, Math.max(0, (progress - i / BAR_COUNT) * BAR_COUNT))
        el.style.transform = `scaleX(${fill})`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden bg-forest
    ">

      {/* ── 3 images — même position, même taille, seuls speed + z-index changent ── */}
      {LAYERS.map((layer, i) => (
        <img
          key={layer.src}
          ref={el => refs.current[i] = el}
          src={layer.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ zIndex: layer.zIndex, willChange: 'transform' }}
        />
      ))}

      {/* ── Logo + tagline ── */}
      <div ref={logoRef} className="absolute left-0 px-12 pb-14" style={{ zIndex: 10, top: '60%', willChange: 'transform' }}>
        <h1>
          <img
            src="/logo-still-coffee.svg"
            alt="STILL coffee"
            style={{ height: '200px', width: 'auto' }}
          />
        </h1>
        <p className="font-serif italic text-cream/45 mt-4 text-lg tracking-wide">
          Where time slows down.
        </p>
      </div>

      {/* ── 4 barres de progression scroll ── */}
      <div
        className="absolute right-12 flex flex-col gap-3"
        style={{ zIndex: 30, top: '50%', transform: 'translateY(-50%)' }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <div
            key={i}
            className="relative overflow-hidden"
            style={{ width: 32, height: 2 }}
          >
            {/* track — fond très discret */}
            <div className="absolute inset-0 bg-cream/15 rounded-full" />
            {/* fill — se déploie de gauche à droite */}
            <div
              ref={el => barRefs.current[i] = el}
              className="absolute inset-0 bg-cream/80 rounded-full origin-left"
              style={{ transform: 'scaleX(0)', willChange: 'transform' }}
            />
          </div>
        ))}
      </div>

    </section>
  )
}
