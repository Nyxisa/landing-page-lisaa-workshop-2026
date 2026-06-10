import { useRef, useEffect } from 'react'

const COUNT = 140

export default function FooterParticles() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    let animId

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (Math.random() - 0.5) * 0.00045,
      r:  0.8 + Math.random() * 1.8,
      op: 0.15 + Math.random() * 0.35,
    }))

    let mouseX = 0.5, mouseY = 0.5

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) / rect.width
      mouseY = (e.clientY - rect.top)  / rect.height
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // subtle attraction toward mouse
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < 0.2) {
          p.vx += dx * 0.00004
          p.vy += dy * 0.00004
        }

        // wrap
        if (p.x < 0) p.x = 1
        if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1
        if (p.y > 1) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,169,100,${p.op})`
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
      window.removeEventListener('mousemove', onMove)
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
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  )
}
