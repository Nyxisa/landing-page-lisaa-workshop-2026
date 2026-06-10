import { useRef, useEffect } from 'react'

// Organic S-curve in viewBox "0 0 22 100"
// preserveAspectRatio="none" stretches y to viewport height while x stays 22px
const PATH_D = 'M 11,1 C 19,12 3,25 11,38 C 19,51 3,64 11,77 C 19,88 4,96 11,99'

export default function ScrollLine() {
  const fillRef = useRef()
  const dotRef  = useRef()

  useEffect(() => {
    const fill = fillRef.current
    const dot  = dotRef.current
    if (!fill || !dot) return

    const len = fill.getTotalLength()
    fill.style.strokeDasharray  = len
    fill.style.strokeDashoffset = len

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0
      fill.style.strokeDashoffset = len * (1 - progress)

      const pt = fill.getPointAtLength(progress * len)
      dot.setAttribute('cx', pt.x)
      dot.setAttribute('cy', pt.y)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed pointer-events-none"
      style={{ zIndex: 3, left: 18, top: 0, bottom: 0, width: 22 }}
    >
      <svg
        width="22"
        height="100%"
        viewBox="0 0 22 100"
        preserveAspectRatio="none"
        overflow="visible"
      >
        {/* Track */}
        <path
          d={PATH_D}
          fill="none"
          stroke="rgba(248,245,230,0.07)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          ref={fillRef}
          d={PATH_D}
          fill="none"
          stroke="rgba(229,80,26,0.7)"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{
            willChange: 'stroke-dashoffset',
            filter: 'drop-shadow(0 0 3px rgba(229,80,26,0.55))',
          }}
        />
        {/* Travelling dot */}
        <circle
          ref={dotRef}
          cx={11} cy={1} r={3}
          fill="#E5501A"
          style={{ filter: 'drop-shadow(0 0 5px rgba(229,80,26,0.85))' }}
        />
      </svg>
    </div>
  )
}
