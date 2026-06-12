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
  const svgRef   = useRef()
  const fillRef  = useRef()
  const ghostRef = useRef()

  useEffect(() => {
    let length     = 0
    let isFull     = false
    let targetProg = 0
    let currentProg = 0
    let rafId

    const build = () => {
      const pageH = document.body.scrollHeight
      svgRef.current.setAttribute('height', pageH)

      const d = buildPath([
        { x: 28,   y: 0 },
        { x: 28,   y: pageH * 0.94 },
        { x: -140, y: pageH * 0.94 },
      ], 22)

      fillRef.current.setAttribute('d', d)
      ghostRef.current.setAttribute('d', d)

      length = fillRef.current.getTotalLength()
      fillRef.current.style.strokeDasharray  = length
      fillRef.current.style.strokeDashoffset = length * (1 - currentProg)
    }

    // Le tip est positionné 55% en dessous du haut du viewport → toujours visible
    // La formule garantit rawProg = 1 à maxScroll
    const calcProg = () => {
      const pageH   = document.body.scrollHeight
      const viewH   = window.innerHeight
      const tipY    = window.scrollY + viewH * 0.55
      return Math.min(1, Math.max(0, tipY / (pageH * 0.94)))
    }

    // Mise à jour fluide en rAF avec lerp
    const animate = () => {
      if (!length) { rafId = requestAnimationFrame(animate); return }

      currentProg += (targetProg - currentProg) * 0.10
      fillRef.current.style.strokeDashoffset = length * (1 - currentProg)

      if (currentProg >= 0.98 && !isFull) {
        isFull = true
        window.dispatchEvent(new CustomEvent('pipes-full'))
      } else if (currentProg < 0.98 && isFull) {
        isFull = false
        window.dispatchEvent(new CustomEvent('pipes-reset'))
      }

      rafId = requestAnimationFrame(animate)
    }

    const onScroll  = () => { targetProg = calcProg() }
    const onResize  = () => { build(); targetProg = calcProg() }

    build()
    targetProg  = calcProg()
    currentProg = targetProg  // pas d'animation d'intro au chargement
    rafId = requestAnimationFrame(animate)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80px',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      {/* Ghost — montre la totalité du chemin en filigrane */}
      <path
        ref={ghostRef}
        stroke="var(--color-sand)"
        strokeOpacity={0.13}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Fill — se remplit au scroll, le tip suit la position dans la page */}
      <path
        ref={fillRef}
        stroke="var(--color-sand)"
        strokeOpacity={0.72}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ willChange: 'stroke-dashoffset' }}
      />
    </svg>
  )
}
