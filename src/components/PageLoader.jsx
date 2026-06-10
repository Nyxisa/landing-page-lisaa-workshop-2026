import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function PageLoader() {
  const overlayRef = useRef()
  const logoRef    = useRef()
  const lineRef    = useRef()

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none'
      },
    })

    // Logo fades in
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
      0.2
    )
    // Line grows below logo
    .fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: 'power2.out' },
      0.8
    )
    // Hold → then wipe entire overlay upward
    .to(overlayRef.current,
      { yPercent: -100, duration: 1, ease: 'power3.inOut', delay: 0.4 },
      1.6
    )
  }, [])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#25432B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        pointerEvents: 'none',
      }}
    >
      <img
        ref={logoRef}
        src="/logo-still-coffee.svg"
        alt="Still Coffee"
        style={{ height: 120, width: 'auto', opacity: 0 }}
      />
      <div
        ref={lineRef}
        style={{
          width: 48,
          height: 1,
          backgroundColor: 'rgba(248,245,230,0.3)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  )
}
