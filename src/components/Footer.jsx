import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FooterParticles from './FooterParticles'

gsap.registerPlugin(ScrollTrigger)

const COLS = [
  {
    head: 'Origins',
    links: ['Colombia — Huila', 'Ethiopia — Yirgacheffe', 'Yemen — Mocha', 'About sourcing', 'Farm partners'],
  },
  {
    head: 'Visit',
    links: ['5 rue Saint-Antoine, Paris', 'Mon – Fri  8:00 – 18:00', 'Sat – Sun  9:00 – 17:00', 'Reservations', 'Private tastings'],
  },
  {
    head: 'Legal',
    links: ['Privacy policy', 'Terms of use', 'Cookie settings', 'Press kit', 'Careers'],
  },
]

export default function Footer() {
  const footerRef = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(footerRef.current.children),
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0,
          duration: 0.85, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 80%' },
        }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="bg-charcoal px-12 pt-20 pb-0 overflow-hidden border-t border-cream/20 relative"
    >
      <FooterParticles />

      {/* Newsletter */}
      <div className="mb-20 grid grid-cols-2 gap-16 items-end border-b border-cream/8 pb-20">
        <div>
          <h3 className="text-cream mb-3">Origin dispatches</h3>
          <p className="text-cream/38 text-[12px] font-avant leading-relaxed max-w-xs">
            Seasonal arrivals, farm stories, tasting notes — straight to your inbox. No noise.
          </p>
        </div>
        <form
          className="flex gap-3 items-center"
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-cream/20 text-cream
                       font-avant text-[12px] px-4 py-3 outline-none
                       placeholder:text-cream/25 focus:border-cream/45
                       transition-colors duration-200"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-orange text-cream font-avant font-bold
                       text-[11px] tracking-[0.18em] uppercase
                       hover:bg-cream hover:text-charcoal transition-colors duration-300
                       shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-12 mb-24">
        {COLS.map(col => (
          <div key={col.head}>
            <h3 className="text-cream mb-6">{col.head}</h3>
            <ul className="space-y-3">
              {col.links.map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[12px] text-cream/42 font-avant
                               hover:text-cream/85 transition-colors duration-200
                               leading-relaxed block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright row */}
      <div className="border-t border-cream/8 pt-6 pb-4 flex items-center justify-between">
        <span className="font-avant text-[10px] tracking-[0.15em] text-cream/22 uppercase">
          © 2026 Still Coffee — All rights reserved
        </span>
        <span className="font-avant text-[10px] tracking-[0.15em] text-cream/18 uppercase">
          Paris, France
        </span>
      </div>

      {/* Large ghost logo — centered, bottom */}
      <div className="-mx-12 flex justify-center">
        <img
          src="/logo-still-coffee.svg"
          alt="STILL coffee"
          style={{
            height: 'clamp(140px, 22vw, 320px)',
            width: 'auto',
            opacity: 0.07,
            filter: 'brightness(3)',
            userSelect: 'none',
          }}
          aria-hidden="true"
        />
      </div>

    </footer>
  )
}
