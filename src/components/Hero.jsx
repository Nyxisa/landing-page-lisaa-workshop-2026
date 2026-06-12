import { useRef, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'

// Speed: 0 = fixe | 1 = scroll normal | négatif = monte plus vite que le scroll
const LAYERS = [
  { src: '/img/Coffee-beans-3.webp', speed: 0.48, zIndex: 5  }, // far bg  — très lent
  { src: '/img/Coffee-beans-2.webp', speed: 0.38, zIndex: 6  }, // mid bg
  { src: '/img/Coffee-beans-1.webp', speed: 0.18, zIndex: 20 }, // devant  — quasi fixe
]
const LOGO_SPEED  = -0.55  // logo s'échappe vers le haut plus vite
const LERP_FACTOR = 0.09   // inertie : 0 = aucune réactivité, 1 = direct

const BAR_COUNT = 3

export default function Hero() {
  const refs    = useRef([])
  const logoRef = useRef()
  const barRefs = useRef([])  // les 4 éléments de remplissage

  // Entrance animation — opacity only, does not conflict with scroll transform
  useLayoutEffect(() => {
    if (!logoRef.current) return
    const children = logoRef.current.children
    gsap.fromTo(
      children,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'power3.out', delay: 0.4 }
    )
  }, [])

  useEffect(() => {
    let rawY    = window.scrollY
    let smoothY = rawY
    let rafId

    const onScroll = () => {
      rawY = window.scrollY

      // barres — réactivité directe, pas besoin d'inertie
      const progress = Math.min(1, rawY / (window.innerHeight * 0.38))
      barRefs.current.forEach((el, i) => {
        if (!el) return
        const fill = Math.min(1, Math.max(0, (progress - i / BAR_COUNT) * BAR_COUNT))
        el.style.opacity = 0.2 + fill * 0.6
      })
    }

    const tick = () => {
      // lerp : smoothY se rapproche de rawY à chaque frame → léger retard naturel
      smoothY += (rawY - smoothY) * LERP_FACTOR

      refs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${smoothY * LAYERS[i].speed}px)`
      })
      if (logoRef.current)
        logoRef.current.style.transform = `translateY(${smoothY * LOGO_SPEED}px)`

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="relative h-screen overflow-hidden bg-forest z-20">

      {/* ── Texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          backgroundImage: `url('/img/texture-tiles.webp')`,
          backgroundSize: 'cover',
          opacity: 0.1,
          mixBlendMode: 'luminosity',
        }}
      />

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

      {/* ── Crema radial overlay ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 11,
          inset: 0,
          background: `
            radial-gradient(ellipse 55% 42% at 50% 48%,
              rgba(180,110,30,0.18) 0%,
              rgba(140,75,20,0.1) 40%,
              transparent 70%
            )
          `,
        }}
      />

{/* ── Logo + tagline ── */}
      <div ref={logoRef} className="absolute left-0 right-0 pb-14" style={{ zIndex: 10, top: '60%', willChange: 'transform' }}>
        <div className="container">
          <h1>
            <img
              src="/logo-still-coffee.svg"
              alt="STILL coffee"
              style={{ height: '120px', width: 'auto' }}
            />
          </h1>
          <h2 className="text-sand/40 mt-6">
            Where time slows down.
          </h2>
        </div>
      </div>

      {/* ── Scroll indicator + barres — bas droite ── */}
      <div
        className="absolute bottom-8 right-12 flex flex-col items-end gap-3"
        style={{ zIndex: 30 }}
      >
        <span
          className="font-serif italic text-cream/35"
          style={{ fontSize: 20 }}
        >
          scroll
        </span>
        <div className="flex flex-col gap-2">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <div
              key={i}
              ref={el => barRefs.current[i] = el}
              className="bg-cream rounded-full"
              style={{ width: 32, height: 2, opacity: 0.2, willChange: 'opacity' }}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
