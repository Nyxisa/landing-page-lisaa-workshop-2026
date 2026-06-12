import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Sticker({
  src,
  style       = {},
  initRotation = -8,
  size         = 130,
  maxRadius    = 90,
  delay        = 0,
}) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Entrance — apparition douce
    gsap.fromTo(el,
      { scale: 0.88, rotation: initRotation - 6, opacity: 0, y: -14 },
      {
        scale: 1, rotation: initRotation, opacity: 1, y: 0,
        duration: 1.0, ease: 'power3.out',
        delay,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }
    )

    let isDragging  = false
    let mouseDownX  = 0, mouseDownY  = 0
    let startGsapX  = 0, startGsapY  = 0

    const quickX = gsap.quickTo(el, 'x', { duration: 0.1, ease: 'power3' })
    const quickY = gsap.quickTo(el, 'y', { duration: 0.1, ease: 'power3' })

    // Hover hint
    const onEnter = () => {
      if (isDragging) return
      gsap.to(el, { scale: 1.04, rotation: initRotation + 2, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => {
      if (isDragging) return
      gsap.to(el, { scale: 1, rotation: initRotation, duration: 0.35, ease: 'power2.out' })
    }

    // Drag
    const onDown = (e) => {
      e.preventDefault()
      isDragging  = true
      mouseDownX  = e.clientX
      mouseDownY  = e.clientY
      startGsapX  = gsap.getProperty(el, 'x')
      startGsapY  = gsap.getProperty(el, 'y')
      gsap.killTweensOf(el)
      gsap.to(el, { scale: 1.07, rotation: initRotation + 3, duration: 0.22, ease: 'power2.out' })
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup',   onUp)
    }

    const onMove = (e) => {
      let tx = startGsapX + (e.clientX - mouseDownX)
      let ty = startGsapY + (e.clientY - mouseDownY)
      // Contraindre au rayon
      const dist = Math.sqrt(tx * tx + ty * ty)
      if (dist > maxRadius) {
        const angle = Math.atan2(ty, tx)
        tx = Math.cos(angle) * maxRadius
        ty = Math.sin(angle) * maxRadius
      }
      quickX(tx)
      quickY(ty)
    }

    const onUp = () => {
      isDragging = false
      // Spring retour à l'origine
      gsap.to(el, {
        x: 0, y: 0,
        scale: 1, rotation: initRotation,
        duration: 1.1, ease: 'elastic.out(0.5, 0.55)',
      })
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousedown',  onDown)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [initRotation, maxRadius, delay])

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      draggable={false}
      style={{
        position:   'absolute',
        width:      size,
        height:     'auto',
        cursor:     'grab',
        userSelect: 'none',
        filter:     'drop-shadow(3px 8px 16px rgba(0,0,0,0.38))',
        willChange: 'transform',
        zIndex:     25,
        opacity:    0,
        ...style,
      }}
    />
  )
}
