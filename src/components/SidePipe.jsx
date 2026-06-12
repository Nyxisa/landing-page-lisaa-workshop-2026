import { useRef, useEffect } from 'react'

function buildPath(points, r = 16) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]
    if (!next) {
      d += ` L ${curr.x},${curr.y}`
    } else {
      const dx1 = Math.sign(curr.x - prev.x)
      const dy1 = Math.sign(curr.y - prev.y)
      const dx2 = Math.sign(next.x - curr.x)
      const dy2 = Math.sign(next.y - curr.y)
      const cx  = curr.x - dx1 * r
      const cy  = curr.y - dy1 * r
      d += ` L ${cx},${cy}`
      const sweep = (dx1 * dy2 - dy1 * dx2) > 0 ? 1 : 0
      d += ` A ${r},${r} 0 0,${sweep} ${curr.x + dx2 * r},${curr.y + dy2 * r}`
    }
  }
  return d
}

export default function SidePipe() {
  const fillRef = useRef()

  useEffect(() => {
    const H = window.innerHeight
    const W = window.innerWidth

    // ~11 coudes orthogonaux irréguliers dans la marge gauche (12–70px)
    // Dernier coude discret : +30px vers la droite seulement
    const d = buildPath([
      { x: 28,  y: 0        },
      { x: 28,  y: H * 0.07 }, { x: 56,  y: H * 0.07 },
      { x: 56,  y: H * 0.15 }, { x: 14,  y: H * 0.15 },
      { x: 14,  y: H * 0.24 }, { x: 66,  y: H * 0.24 },
      { x: 66,  y: H * 0.33 }, { x: 20,  y: H * 0.33 },
      { x: 20,  y: H * 0.42 }, { x: 60,  y: H * 0.42 },
      { x: 60,  y: H * 0.51 }, { x: 12,  y: H * 0.51 },
      { x: 12,  y: H * 0.60 }, { x: 70,  y: H * 0.60 },
      { x: 70,  y: H * 0.69 }, { x: 24,  y: H * 0.69 },
      { x: 24,  y: H * 0.78 }, { x: 52,  y: H * 0.78 },
      { x: 52,  y: H * 0.86 }, { x: 18,  y: H * 0.86 },
      { x: 18,  y: H * 0.93 }, { x: 48,  y: H * 0.93 }, // dernier coude : +30px seulement
    ], 14)

    fillRef.current.setAttribute('d', d)

    const length = fillRef.current.getTotalLength()
    fillRef.current.style.strokeDasharray  = length
    fillRef.current.style.strokeDashoffset = length // vide au départ

    let isFull = false

    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      if (!maxScroll) return
      const rawProg    = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      const visualProg = Math.pow(rawProg, 1.2)

      fillRef.current.style.strokeDashoffset = length * (1 - visualProg)

      if (rawProg >= 0.97 && !isFull) {
        isFull = true
        window.dispatchEvent(new CustomEvent('pipes-full'))
      } else if (rawProg < 0.97 && isFull) {
        isFull = false
        window.dispatchEvent(new CustomEvent('pipes-reset'))
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // état initial
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10, // sous hero/marquee (z-20) mais au-dessus des sections normales
        overflow: 'visible',
      }}
    >
      <path
        ref={fillRef}
        stroke="var(--color-sand)"
        strokeOpacity={0.70}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ willChange: 'stroke-dashoffset' }}
      />
    </svg>
  )
}
