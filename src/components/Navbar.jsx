import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'

export default function Navbar() {
  const navRef    = useRef()
  const logoRef   = useRef()

  useLayoutEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -56, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 }
    )

    // Two-part logo entrance
    const [stillEl, coffeeEl] = logoRef.current.querySelectorAll('img')
    gsap.fromTo(stillEl,
      { opacity: 0, x: -14 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }
    )
    gsap.fromTo(coffeeEl,
      { opacity: 0, x: 14 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 }
    )

    const onScroll = () => {
      const scrolled = window.scrollY > 60
      gsap.to(navRef.current, {
        backgroundColor: scrolled ? 'rgba(41,41,41,0.97)' : 'rgba(41,41,41,0.72)',
        duration: 0.35,
        overwrite: 'auto',
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 h-14
                 bg-charcoal/85 backdrop-blur-md border-b border-cream/5"
    >
      {/* Logo — two SVGs with gap-hover animation */}
      <a href="#">
        <div
          ref={logoRef}
          className="flex items-center"
          style={{ gap: 7, transition: 'gap 0.32s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = '16px' }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = '7px' }}
        >
          <img src="/logo-still.svg"  alt="STILL"  style={{ height: 19, width: 'auto' }} />
          <img src="/logo-coffee.svg" alt="coffee" style={{ height: 19, width: 'auto' }} />
        </div>
      </a>

      {/* Links */}
      <div className="flex items-center gap-7">
        <a href="#about"
           className="text-[11px] font-avant tracking-[0.25em] uppercase text-cream/55
                      hover:text-cream transition-colors duration-200">
          Our story
        </a>
        <a href="#"
           className="text-[11px] font-avant tracking-[0.25em] uppercase
                      border border-cream/30 text-cream/55
                      hover:border-cream/70 hover:text-cream
                      px-4 py-1.5 rounded-full transition-all duration-200">
          Merch
        </a>
        <a href="#coffees"
           className="text-[11px] font-avant tracking-[0.2em] uppercase
                      bg-orange text-cream px-5 py-2 rounded-full
                      hover:bg-orange/85 transition-colors duration-200">
          Find your next coffee
        </a>
      </div>
    </nav>
  )
}
