import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function BackToTop() {
  const btnRef = useRef()

  useEffect(() => {
    const btn = btnRef.current
    gsap.set(btn, { autoAlpha: 0, y: 12 })

    const onScroll = () => {
      const visible = window.scrollY > window.innerHeight * 0.6
      gsap.to(btn, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 12,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 44,
        zIndex: 9000,
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2px solid var(--color-cream)',
        backgroundImage: 'url(/img/texture-steel.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
      }}
      onMouseEnter={() => gsap.to(btnRef.current, { y: -6, duration: 0.35, ease: 'power2.out' })}
      onMouseLeave={() => gsap.to(btnRef.current, { y: 0,  duration: 0.45, ease: 'power2.out' })}
    >
      <span style={{ fontSize: 16, color: 'var(--color-cream)', transform: 'rotate(-90deg)', display: 'block', lineHeight: 1 }}>
        ➤
      </span>
    </button>
  )
}
