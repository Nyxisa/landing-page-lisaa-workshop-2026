import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const blobRef = useRef()
  const dotRef  = useRef()

  useEffect(() => {
    const blob = blobRef.current
    const dot  = dotRef.current

    const style = document.createElement('style')
    style.textContent = [
      '*, *::before, *::after { cursor: none !important; }',
      'input, textarea, select { cursor: text !important; }',
    ].join(' ')
    document.head.appendChild(style)

    gsap.set([blob, dot], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    let shown = false

    const onMove = (e) => {
      if (!shown) {
        gsap.to([blob, dot], { autoAlpha: 1, duration: 0.4, stagger: 0.05 })
        shown = true
      }
      // blob follows with lag
      gsap.to(blob, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      // dot snaps almost immediately
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.1,  ease: 'none',       overwrite: 'auto' })
    }

    const grow   = () => { gsap.to(blob, { scale: 1.4, duration: 0.35, ease: 'power2.out' }); gsap.to(dot, { scale: 0, duration: 0.2 }) }
    const shrink = () => { gsap.to(blob, { scale: 1,   duration: 0.35, ease: 'power2.out' }); gsap.to(dot, { scale: 1, duration: 0.2 }) }

    const attachHover = () => {
      document.querySelectorAll('.coffee-card, button, a[href]').forEach(t => {
        t.addEventListener('mouseenter', grow)
        t.addEventListener('mouseleave', shrink)
      })
    }

    window.addEventListener('mousemove', onMove)
    const id = setTimeout(attachHover, 300)

    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(id)
      document.querySelectorAll('.coffee-card, button, a[href]').forEach(t => {
        t.removeEventListener('mouseenter', grow)
        t.removeEventListener('mouseleave', shrink)
      })
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      {/* Ambient blob */}
      <div
        ref={blobRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 24, height: 24, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.4)',
          pointerEvents: 'none', zIndex: 9997,
          willChange: 'transform',
          opacity: 0.75,
        }}
      />
      {/* Precision dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: 'var(--color-cream)',
          pointerEvents: 'none', zIndex: 9999,
          willChange: 'transform',
        }}
      />
    </>
  )
}
