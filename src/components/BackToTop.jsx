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
        border: '1px solid rgba(248,245,230,0.18)',
        backgroundColor: 'rgba(41,41,41,0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,80,26,0.65)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,245,230,0.18)' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 11 L7 3 M3 6 L7 2 L11 6" stroke="rgba(248,245,230,0.65)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
