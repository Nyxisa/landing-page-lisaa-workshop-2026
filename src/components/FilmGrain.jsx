import { useRef, useEffect } from 'react'

const FPS = 12
const INTERVAL = 1000 / FPS

export default function FilmGrain() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId
    let last = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const draw = (now) => {
      rafId = requestAnimationFrame(draw)
      if (now - last < INTERVAL) return
      last = now

      const w = canvas.width
      const h = canvas.height
      const img = ctx.createImageData(w, h)
      const d   = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i]     = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        pointerEvents: 'none',
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
