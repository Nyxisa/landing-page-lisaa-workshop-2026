import { useRef, useEffect } from 'react'

const REPULSE_R = 90
const REPULSE_F = 4.5
const SPRING    = 0.06
const DAMP      = 0.78
const DELAY     = 350
const RAMP      = 750

const SPACING   = 8    // px entre centres — gap visuel ~4px avec r≈2px
const JITTER    = 3    // ±px de bruit de position (aspérités)
const BATCHES   = 8    // niveaux d'opacité groupés → 8 fill() au lieu de N
const MAX_OP    = 0.30 // opacité max d'une particule

function fadeLeft(x, W) {
  return Math.min(1, Math.max(0, (x - W * 0.04) / (W * 0.18)))
}

function genParticles(W, H) {
  const solids = []
  const cols   = Math.ceil(W / SPACING) + 1
  const rows   = Math.ceil(H / SPACING) + 1

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bx = col * SPACING + (Math.random() - 0.5) * JITTER * 2
      const by = row * SPACING + (Math.random() - 0.5) * JITTER * 2
      if (bx < -4 || bx > W + 4 || by < -4 || by > H + 4) continue
      const fl = fadeLeft(bx, W)
      if (fl < 0.02) continue
      const r  = 1.0 + Math.random() * 1.2       // 1–2.2px
      const op = fl * (0.12 + Math.random() * 0.18) // max ~0.30
      solids.push({ bx, by, x: bx, y: by, vx: 0, vy: 0, r, op, t: 0 })
    }
  }

  // Pré-tri par opacité → le rendu par batch n'a besoin d'aucun tableau dynamique
  solids.sort((a, b) => a.op - b.op)

  // Anneaux décoratifs (trous dans la mousse)
  const rings = []
  for (let i = 0; i < 5; i++) {
    const bx = W * (0.10 + Math.random() * 0.80)
    const by = H * (0.10 + Math.random() * 0.80)
    rings.push({
      bx, by, x: bx, y: by, vx: 0, vy: 0,
      r:  14 + Math.random() * 22,
      op: 0.04 + Math.random() * 0.08,
      t:  0,
    })
  }

  return { solids, rings }
}

export default function FoamReveal({ containerRef }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef?.current
    if (!canvas || !container) return

    const ctx  = canvas.getContext('2d')
    let solids = [], rings = []
    let rafId
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      const W = container.offsetWidth
      const H = container.offsetHeight
      canvas.width  = W
      canvas.height = H
      const gen = genParticles(W, H)
      solids = gen.solids
      rings  = gen.rings
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      const W   = canvas.width
      const H   = canvas.height
      const now = performance.now()

      ctx.clearRect(0, 0, W, H)

      // Haze légère — comble les micro-gaps
      const haze = ctx.createLinearGradient(0, 0, W, 0)
      haze.addColorStop(0,    'rgba(240,232,212,0)')
      haze.addColorStop(0.06, 'rgba(240,232,212,0)')
      haze.addColorStop(0.28, 'rgba(238,230,208,0.07)')
      haze.addColorStop(1,    'rgba(242,235,215,0.16)')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, W, H)

      // ── Physique + rendu batché ───────────────────────────────────────────
      // Particules triées par op → on flush un fill() à chaque changement de bucket
      let currentBucket = -1

      for (const p of solids) {
        // Physique
        const dx   = p.x - mouse.x
        const dy   = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPULSE_R && dist > 0.5) {
          const force = ((REPULSE_R - dist) / REPULSE_R) * REPULSE_F
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          p.t   = now
        }

        const age = now - p.t
        const str = Math.min(1, Math.max(0, (age - DELAY) / RAMP))
        p.vx += (p.bx - p.x) * SPRING * str
        p.vy += (p.by - p.y) * SPRING * str
        p.vx *= DAMP
        p.vy *= DAMP
        p.x  += p.vx
        p.y  += p.vy

        // Batch : flush quand le bucket change
        const bucket = Math.min(BATCHES - 1, Math.floor((p.op / MAX_OP) * BATCHES))
        if (bucket !== currentBucket) {
          if (currentBucket >= 0) ctx.fill()
          const alpha = ((bucket + 0.5) / BATCHES) * MAX_OP
          ctx.fillStyle = `rgba(242,235,215,${alpha.toFixed(3)})`
          ctx.beginPath()
          currentBucket = bucket
        }
        ctx.moveTo(p.x + p.r, p.y)
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      }
      if (currentBucket >= 0) ctx.fill()

      // ── Anneaux ──────────────────────────────────────────────────────────
      for (const p of rings) {
        const age = now - p.t
        const str = Math.min(1, Math.max(0, (age - DELAY) / RAMP))
        p.vx += (p.bx - p.x) * SPRING * str
        p.vy += (p.by - p.y) * SPRING * str
        p.vx *= DAMP; p.vy *= DAMP
        p.x  += p.vx;  p.y  += p.vy
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(235,228,205,${p.op})`
        ctx.lineWidth   = 0.7
        ctx.stroke()
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const onMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    container.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
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
