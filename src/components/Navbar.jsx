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
        backgroundColor: scrolled ? 'var(--color-maroon)' : 'color-mix(in srgb, var(--color-maroon) 70%, transparent)',
        duration: 0.4,
        overwrite: 'auto',
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 z-50 h-20
                 bg-maroon/85 backdrop-blur-md border-b border-sand/20"
    >
      <div className="container flex items-center justify-between h-full">
      {/* Logo — two SVGs with gap-hover animation */}
      <a href="#">
        <div
          ref={logoRef}
          className="flex items-center"
          style={{ gap: 4, transition: 'gap 0.32s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = '12px' }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = '4px' }}
        >
          <img src="/logo-still.svg"  alt="STILL"  style={{ height: 20, width: 'auto' }} />
          <img src="/logo-coffee.svg" alt="coffee" style={{ height: 20, width: 'auto' }} />
        </div>
      </a>

      {/* Links */}
      <div className="flex items-center gap-8">
        <a href="#about" className="nav-link text-cream hover:text-sky transition-all duration-400">
          Our story
        </a>
        <a href="#" className="nav-link text-cream hover:text-sky transition-all duration-400">
          Merch
        </a>
          <a href="#coffees" className="nav-link border-2 text-cream px-4 py-2 rounded-full hover:bg-cream hover:text-maroon
         transition-colors duration-400">
          Find your next coffee
        </a>
      </div>
      </div>
    </nav>
  )
}
