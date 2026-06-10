import { useRef, useEffect } from 'react'

function drawFoamToCanvas(ctx, W, H) {
  ctx.clearRect(0, 0, W, H)

  // Base haze — intensifies towards right
  const haze = ctx.createLinearGradient(W * 0.2, 0, W, 0)
  haze.addColorStop(0,   'rgba(240,232,212,0)')
  haze.addColorStop(0.35,'rgba(238,230,208,0.12)')
  haze.addColorStop(0.7, 'rgba(240,232,210,0.35)')
  haze.addColorStop(1,   'rgba(242,235,215,0.55)')
  ctx.fillStyle = haze
  ctx.fillRect(0, 0, W, H)

  // 700 tiny spray dots (radius 1–7px)
  for (let i = 0; i < 700; i++) {
    const t  = Math.pow(Math.random(), 0.45)       // bias strongly right
    const x  = W * (0.15 + t * 0.88)
    const y  = Math.random() * H
    const r  = 0.8 + Math.random() * 6.5
    const rl = Math.max(0, (x - W * 0.15) / (W * 0.85))
    const op = rl * (0.2 + Math.random() * 0.55)

    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(242,235,215,${op})`
    ctx.fill()

    // Tiny highlight on larger drops
    if (r > 3) {
      ctx.beginPath()
      ctx.arc(x - r * 0.3, y - r * 0.32, r * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,252,246,${op * 0.55})`
      ctx.fill()
    }
  }

  // 140 outlined foam bubbles (radius 5–18px) — no fill, just stroke
  for (let i = 0; i < 140; i++) {
    const t  = Math.pow(Math.random(), 0.6)
    const x  = W * (0.22 + t * 0.82)
    const y  = Math.random() * H
    const r  = 4 + Math.random() * 14
    const rl = Math.max(0, (x - W * 0.2) / (W * 0.8))
    const op = rl * (0.18 + Math.random() * 0.28)

    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(235,228,205,${op})`
    ctx.lineWidth = 0.7
    ctx.stroke()
  }
}

export default function FoamReveal({ containerRef }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef?.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    const BRUSH = 88

    // Offscreen canvas = "full foam" reference for restoration
    const foam    = document.createElement('canvas')
    const foamCtx = foam.getContext('2d')

    const resize = () => {
      canvas.width = foam.width  = container.offsetWidth
      canvas.height = foam.height = container.offsetHeight
      drawFoamToCanvas(foamCtx, foam.width, foam.height)
      drawFoamToCanvas(ctx, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    // --- Erase ---
    let lastX = -9999, lastY = -9999

    const erase = (x, y) => {
      const dist  = Math.hypot(x - lastX, y - lastY)
      const steps = Math.max(1, Math.ceil(dist / 10))
      ctx.globalCompositeOperation = 'destination-out'

      for (let i = 0; i <= steps; i++) {
        const px   = lastX + (x - lastX) * (i / steps)
        const py   = lastY + (y - lastY) * (i / steps)
        const grad = ctx.createRadialGradient(px, py, 0, px, py, BRUSH)
        grad.addColorStop(0,   'rgba(0,0,0,1)')
        grad.addColorStop(0.5, 'rgba(0,0,0,0.88)')
        grad.addColorStop(0.8, 'rgba(0,0,0,0.3)')
        grad.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(px, py, BRUSH, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    // --- Restore after hover ---
    let restoreId    = null
    let restoreDelay = null

    const startRestore = () => {
      let frames = 0
      const tick = () => {
        ctx.globalAlpha = 0.022          // ~2.2% blended each frame → ~2s full restore
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(foam, 0, 0)
        ctx.globalAlpha = 1
        frames++
        restoreId = frames < 130 ? requestAnimationFrame(tick) : null
      }
      restoreId = requestAnimationFrame(tick)
    }

    const cancelRestore = () => {
      if (restoreId)    { cancelAnimationFrame(restoreId); restoreId = null }
      if (restoreDelay) { clearTimeout(restoreDelay);       restoreDelay = null }
    }

    const onMove = (e) => {
      cancelRestore()
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      erase(x, y)
      lastX = x; lastY = y
    }

    const onLeave = () => {
      lastX = -9999; lastY = -9999
      restoreDelay = setTimeout(startRestore, 700)
    }

    container.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave)

    return () => {
      cancelRestore()
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 9,
        pointerEvents: 'none',
      }}
    />
  )
}
