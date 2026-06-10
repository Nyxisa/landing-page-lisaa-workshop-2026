import { useRef, useEffect } from 'react'

// Chemin serpentin qui traverse toute la hauteur de page (viewBox 0-100).
// Courbes intentionnellement irrégulières — amplitude variable, pas un sinus.
const PATH = [
  'M 55 0',
  'C 82 4,  28 11, 42 20',   // large courbe vers la droite puis gauche
  'C 58 29, 90 36, 64 46',   // swing droit, large
  'C 38 56, 10 62, 36 72',   // traverse vers la gauche, profond
  'C 62 82, 78 88, 50 100',  // revient vers le centre en bas
].join(' ')

export default function ScrollLine() {
  const fillRef = useRef()

  useEffect(() => {
    const el = fillRef.current
    if (!el) return

    const len = el.getTotalLength()

    // Initialiser : le fill est intégralement masqué
    el.style.strokeDasharray  = len
    el.style.strokeDashoffset = len

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0
      el.style.strokeDashoffset = len * (1 - progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 3 }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Track — le fil complet, très discret */}
        <path
          d={PATH}
          fill="none"
          stroke="rgba(248,245,230,0.07)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Fill — se révèle au scroll (trim-path via dashoffset) */}
        <path
          ref={fillRef}
          d={PATH}
          fill="none"
          stroke="rgba(248,245,230,0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ willChange: 'stroke-dashoffset' }}
        />
      </svg>
    </div>
  )
}
