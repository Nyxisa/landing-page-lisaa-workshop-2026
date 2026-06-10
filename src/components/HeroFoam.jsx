import { useRef, useEffect } from 'react'

const BUBBLES = 120

export default function HeroFoam() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    let animId
    let t = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    // Each bubble: position, radius, speed, color
    const bubbles = Array.from({ length: BUBBLES }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      r:  1.5 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: -(0.00008 + Math.random() * 0.00025), // float upward
      op: 0.08 + Math.random() * 0.22,
      // warm cream/gold palette
      h:  28 + Math.random() * 32, // hue 28-60 (cream/amber)
      s:  30 + Math.random() * 40,
    }))

    const draw = () => {
      t += 0.016
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      for (const b of bubbles) {
        b.x += b.vx
        b.y += b.vy + Math.sin(t * 0.4 + b.r) * 0.00015

        // wrap
        if (b.y < -0.05) b.y = 1.05
        if (b.x < -0.05) b.x = 1.05
        if (b.x >  1.05) b.x = -0.05

        const bx = b.x * W
        const by = b.y * H

        // bubble ring
        ctx.beginPath()
        ctx.arc(bx, by, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${b.h}, ${b.s}%, 88%, ${b.op})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // inner highlight (small glint)
        ctx.beginPath()
        ctx.arc(bx - b.r * 0.25, by - b.r * 0.25, b.r * 0.18, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${b.h}, ${b.s}%, 95%, ${b.op * 0.6})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 12,
        pointerEvents: 'none',
        opacity: 0.9,
        mixBlendMode: 'screen',
      }}
    />
  )
}
