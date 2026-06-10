import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Continent SVG paths (equirectangular, viewBox 1000×500) — same data as Origins.jsx
const LAND = [
  "M 150,80 L 200,53 L 260,52 L 292,70 L 314,92 L 300,115 L 316,141 L 322,164 L 298,186 L 278,212 L 263,233 L 248,260 L 240,282 L 224,296 L 206,294 L 196,310 L 184,331 L 178,352 L 186,372 L 184,390 L 174,382 L 160,362 L 148,340 L 140,316 L 132,288 L 119,261 L 106,237 L 104,212 L 113,190 L 126,170 L 131,148 L 127,120 L 131,98 L 140,84 Z",
  "M 355,30 L 380,20 L 407,22 L 430,33 L 440,47 L 430,60 L 410,65 L 388,62 L 366,50 Z",
  "M 225,202 L 244,200 L 260,205 L 258,212 L 240,215 L 225,210 Z",
  "M 281,222 L 298,218 L 320,221 L 347,230 L 370,241 L 398,255 L 412,272 L 412,288 L 406,312 L 397,334 L 388,356 L 377,378 L 362,398 L 346,411 L 329,415 L 312,409 L 302,394 L 297,373 L 294,349 L 291,325 L 282,302 L 271,278 L 267,256 L 272,240 Z",
  "M 474,149 L 482,133 L 488,122 L 503,113 L 518,108 L 534,104 L 550,98 L 560,88 L 564,77 L 557,67 L 540,64 L 522,68 L 507,77 L 494,90 L 483,104 L 477,119 L 474,136 Z",
  "M 437,65 L 447,60 L 457,63 L 458,72 L 448,76 L 438,72 Z",
  "M 484,155 L 510,149 L 530,150 L 547,159 L 560,173 L 568,192 L 576,212 L 576,232 L 568,253 L 556,271 L 545,290 L 540,310 L 542,328 L 543,344 L 532,360 L 516,372 L 498,374 L 480,363 L 464,346 L 454,326 L 450,302 L 451,277 L 455,257 L 452,235 L 457,214 L 463,196 L 470,178 L 476,162 Z",
  "M 588,300 L 592,288 L 598,295 L 598,315 L 593,326 L 587,318 Z",
  "M 608,157 L 630,151 L 650,156 L 665,166 L 668,182 L 660,198 L 645,208 L 627,212 L 612,207 L 603,193 L 604,173 Z",
  "M 680,159 L 705,153 L 728,155 L 748,164 L 753,181 L 749,198 L 738,215 L 725,229 L 710,233 L 695,227 L 683,213 L 677,194 Z",
  "M 530,145 L 572,136 L 618,127 L 664,118 L 712,110 L 758,106 L 804,104 L 844,108 L 878,117 L 906,129 L 928,143 L 947,158 L 958,175 L 960,192 L 952,210 L 932,222 L 904,230 L 872,236 L 838,237 L 800,232 L 764,223 L 734,216 L 712,220 L 695,228 L 676,225 L 657,215 L 640,208 L 623,210 L 610,207 L 603,194 L 604,174 L 608,157 L 589,152 L 569,141 L 548,138 L 527,141 L 507,145 L 488,150 L 475,150 L 474,148 L 480,133 L 504,113 L 534,104 L 564,77 L 542,65 L 510,68 L 490,90 L 475,135 Z",
  "M 876,120 L 886,112 L 897,118 L 897,130 L 884,136 Z",
  "M 818,292 L 848,282 L 878,276 L 906,283 L 924,298 L 926,318 L 918,338 L 904,352 L 887,361 L 864,363 L 838,354 L 818,340 L 812,320 Z",
]

const ORIGIN_COORDS = [
  { lat: 2.0,  lon: -75.8 }, // Colombia
  { lat: 6.1,  lon:  38.4 }, // Ethiopia
  { lat: 14.5, lon:  44.2 }, // Yemen
]

function latLonToXYZ(lat, lon, r = 1.52) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  ]
}

function buildTexture() {
  const TW = 2048, TH = 1024
  const c   = document.createElement('canvas')
  c.width   = TW; c.height = TH
  const ctx = c.getContext('2d')

  // Deep ocean
  ctx.fillStyle = '#101A13'
  ctx.fillRect(0, 0, TW, TH)

  // Graticule
  ctx.strokeStyle = 'rgba(195,175,100,0.055)'
  ctx.lineWidth = 0.6
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = (90 - lat) / 180 * TH
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(TW, y); ctx.stroke()
  }
  for (let lon = -150; lon <= 180; lon += 30) {
    const x = (lon + 180) / 360 * TW
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, TH); ctx.stroke()
  }
  // Equator highlight
  ctx.strokeStyle = 'rgba(195,175,100,0.1)'
  ctx.beginPath(); ctx.moveTo(0, TH / 2); ctx.lineTo(TW, TH / 2); ctx.stroke()

  // Continents (scale 1000×500 → 2048×1024)
  ctx.save()
  ctx.scale(TW / 1000, TH / 500)
  ctx.fillStyle = '#1E3024'
  ctx.strokeStyle = 'rgba(195,175,90,0.25)'
  ctx.lineWidth = 0.5
  for (const d of LAND) {
    const p = new Path2D(d)
    ctx.fill(p)
    ctx.stroke(p)
  }
  ctx.restore()

  return c
}

function GlobeScene({ rotRef }) {
  const groupRef = useRef()

  const texture = useMemo(() => {
    const c   = buildTexture()
    const tex = new THREE.CanvasTexture(c)
    return tex
  }, [])

  useFrame(() => {
    if (groupRef.current && rotRef) {
      groupRef.current.rotation.y = rotRef.current
    }
  })

  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight position={[5, 3, 4]} intensity={1.2} color="#fff8f0" />
      <pointLight position={[-5, -2, -4]} intensity={0.28} color="#162518" />

      <group ref={groupRef}>
        {/* Globe */}
        <mesh>
          <sphereGeometry args={[1.5, 72, 36]} />
          <meshStandardMaterial map={texture} roughness={0.82} metalness={0.04} />
        </mesh>

        {/* Atmosphere */}
        <mesh>
          <sphereGeometry args={[1.59, 32, 16]} />
          <meshStandardMaterial
            transparent opacity={0.065}
            color="#3D8A50"
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Orange origin dots */}
        {ORIGIN_COORDS.map((o, i) => {
          const [x, y, z] = latLonToXYZ(o.lat, o.lon)
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color="#E5501A" />
            </mesh>
          )
        })}
      </group>
    </>
  )
}

export default function Globe3D({ rotRef, style }) {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <GlobeScene rotRef={rotRef} />
      </Canvas>
    </div>
  )
}
