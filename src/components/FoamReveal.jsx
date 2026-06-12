import { useRef, useEffect } from 'react'

const MAX_AGE        = 1200   // ms — durée de vie d'un point de trail
const TRAIL_R        = 72    // px — rayon de dispersion
const CLUSTER_N      = 24     // blobs par point de trail (bord organique)
const CLUSTER_JITTER = 18    // ±px de variation de position par blob
const SPACING        = 2     // px — densité micro-dots (pré-rendu unique, pas de perf per-frame)
const JITTER         = 1   // aspérités de la grille
const MAX_OP         = 1  // opacité maximale des dots
const BATCHES        = 12    // niveaux d'opacité groupés pour le pré-rendu

function foamBoundary(y, W, H) {
  return W * 0.46
    + Math.sin(y * 0.011)         * W * 0.055
    + Math.sin(y * 0.027 + 1.8)   * W * 0.025
    + Math.sin(y * 0.006 + 0.7)   * W * 0.038
}

function fadeWave(x, y, W, H) {
  return Math.min(1, Math.max(0, (x - foamBoundary(y, W, H)) / (W * 0.07)))
}

// Pré-rendu de la mousse statique — exécuté une seule fois à l'init / resize
function renderFoamBase(W, H) {
  const oc  = new OffscreenCanvas(W, H)
  const ctx = oc.getContext('2d')
  const pts = []
  const cols = Math.ceil(W / SPACING) + 1
  const rows = Math.ceil(H / SPACING) + 1

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bx = col * SPACING + (Math.random() - 0.5) * JITTER * 2
      const by = row * SPACING + (Math.random() - 0.5) * JITTER * 2
      if (bx < -2 || bx > W + 2 || by < -2 || by > H + 2) continue
      const fl = fadeWave(bx, by, W, H)
      if (fl < 0.02) continue
      pts.push({
        bx, by,
        r:  0.8 + Math.random() * 0.7,
        op: fl * (0.4 + Math.pow(Math.random(), 0.3) * 0.6),
      })
    }
  }

  pts.sort((a, b) => a.op - b.op)
  let cur = -1
  for (const p of pts) {
    const b = Math.min(BATCHES - 1, Math.floor((p.op / MAX_OP) * BATCHES))
    if (b !== cur) {
      if (cur >= 0) ctx.fill()
      ctx.fillStyle = `rgba(242,235,215,${(((b + 0.5) / BATCHES) * MAX_OP).toFixed(3)})`
      ctx.beginPath()
      cur = b
    }
    ctx.moveTo(p.bx + p.r, p.by)
    ctx.arc(p.bx, p.by, p.r, 0, Math.PI * 2)
  }
  if (cur >= 0) ctx.fill()

  return oc
}

// Blob doux pré-rendu : chaque point de trail stampe N copies légèrement décalées
// → les bords irréguliers des blobs créent le contour organique "mousse qui s'écarte"
function renderBlob(r) {
  const size = r * 2
  const oc   = new OffscreenCanvas(size, size)
  const ctx  = oc.getContext('2d')
  const grd  = ctx.createRadialGradient(r, r, 0, r, r, r)
  grd.addColorStop(0,   'rgba(255,255,255,1)')
  grd.addColorStop(0.5, 'rgba(255,255,255,0.8)')
  grd.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)
  return oc
}

// Cluster fixe par point de trail : positions aléatoires figées à la création
function genCluster() {
  return Array.from({ length: CLUSTER_N }, () => ({
    dx: (Math.random() - 0.5) * CLUSTER_JITTER * 2,
    dy: (Math.random() - 0.5) * CLUSTER_JITTER * 2,
  }))
}

export default function FoamReveal({ containerRef }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef?.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')

    let foamBase = null
    let blob     = null
    let trailCvs = null, tCtx = null
    let compCvs  = null, cCtx = null
    let rafId
    const trail    = []   // { x, y, time, cluster }
    let lastSample = 0

    const resize = () => {
      const W = container.offsetWidth
      const H = container.offsetHeight
      canvas.width  = W
      canvas.height = H
      foamBase = renderFoamBase(W, H)
      blob     = renderBlob(TRAIL_R)
      trailCvs = new OffscreenCanvas(W, H)
      tCtx     = trailCvs.getContext('2d')
      compCvs  = new OffscreenCanvas(W, H)
      cCtx     = compCvs.getContext('2d')
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      const W   = canvas.width
      const H   = canvas.height
      const now = performance.now()

      // Nettoyer les points expirés (FIFO — premier parti = premier reformé)
      while (trail.length && now - trail[0].time > MAX_AGE) trail.shift()

      // ── Trail canvas : blobs de dispersion ───────────────────────────────
      tCtx.clearRect(0, 0, W, H)
      for (const pt of trail) {
        const t     = (now - pt.time) / MAX_AGE
        const alpha = (1 - t) * (1 - t) * 0.88  // fade quadratique
        tCtx.globalAlpha = alpha
        for (const { dx, dy } of pt.cluster) {
          tCtx.drawImage(blob, pt.x + dx - TRAIL_R, pt.y + dy - TRAIL_R, TRAIL_R * 2, TRAIL_R * 2)
        }
      }
      tCtx.globalAlpha = 1

      // ── Composite : mousse statique percée par le trail ──────────────────
      cCtx.clearRect(0, 0, W, H)
      cCtx.globalCompositeOperation = 'source-over'
      cCtx.drawImage(foamBase, 0, 0)
      cCtx.globalCompositeOperation = 'destination-out'
      cCtx.drawImage(trailCvs, 0, 0)
      cCtx.globalCompositeOperation = 'source-over'

      // ── Main canvas ───────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H)

      const haze = ctx.createLinearGradient(0, 0, W, 0)
      haze.addColorStop(0,    'rgba(240,232,212,0)')
      haze.addColorStop(0.40, 'rgba(240,232,212,0)')
      haze.addColorStop(0.56, 'rgba(238,230,208,0.06)')
      haze.addColorStop(1,    'rgba(242,235,215,0.14)')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, W, H)

      ctx.drawImage(compCvs, 0, 0)

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastSample < 16) return  // max ~60 points/s
      const rect = container.getBoundingClientRect()
      trail.push({
        x:       e.clientX - rect.left,
        y:       e.clientY - rect.top,
        time:    now,
        cluster: genCluster(),
      })
      lastSample = now
    }

    container.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', onMove)
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
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'blur(8px)',
      }}
    />
  )
}
