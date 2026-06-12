import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const ORIGIN_COORDS = [
  { lat: 2.0,  lon: -75.8, name: 'Colombia' },
  { lat: 6.1,  lon:  38.4, name: 'Ethiopia' },
  { lat: 34.9, lon: 135.8, name: 'Japan'    },
]

function latLonToXYZ(lat, lon, r = 1.37) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  ]
}

function buildShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0,    'rgba(0,0,0,0.90)')
  g.addColorStop(0.40, 'rgba(0,0,0,0.52)')
  g.addColorStop(0.70, 'rgba(0,0,0,0.15)')
  g.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return c
}

function buildGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  g.addColorStop(0,    'rgba(210,188,152,0.28)')
  g.addColorStop(0.38, 'rgba(210,188,152,0.16)')
  g.addColorStop(0.65, 'rgba(210,188,152,0.06)')
  g.addColorStop(1,    'rgba(210,188,152,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 512)
  return c
}

function GlobeScene({ rotRef }) {
  const groupRef    = useRef()
  const shadowRef   = useRef()
  const globeMeshRef = useRef()

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/img/earth-map.webp')
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 16
    return tex
  }, [])

  const shadowTex = useMemo(() => new THREE.CanvasTexture(buildShadowTexture()), [])
  const glowTex   = useMemo(() => new THREE.CanvasTexture(buildGlowTexture()),   [])

  useFrame((state) => {
    if (!groupRef.current) return
    if (rotRef) groupRef.current.rotation.y = rotRef.current

    const t = state.clock.elapsedTime
    const f = Math.sin(t * 0.55) * 0.055
    groupRef.current.position.y = f

    if (shadowRef.current) {
      const s = 1 - f * 0.08
      shadowRef.current.scale.set(s, s, 1)
      shadowRef.current.material.opacity = 0.52 - f * 0.04
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 8]} intensity={3} />
      <pointLight position={[-4, 1, -3]} intensity={4} color="#D2BC98" />

      {/* Ombre au sol — plus prononcée et circulaire */}
      <mesh ref={shadowRef} position={[0, -1.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.52} depthWrite={false} />
      </mesh>

      {/* Halo circulaire flou — plan fixe derrière le globe */}
      <mesh position={[0, 0, -1.45]}>
        <planeGeometry args={[5.2, 5.2]} />
        <meshBasicMaterial map={glowTex} transparent depthWrite={false} />
      </mesh>

      <group ref={groupRef}>
        <mesh ref={globeMeshRef}>
          <sphereGeometry args={[1.35, 72, 36]} />
          <meshStandardMaterial map={texture} roughness={1} metalness={0.1} />
        </mesh>

        {ORIGIN_COORDS.map((o, i) => {
          const [x, y, z] = latLonToXYZ(o.lat, o.lon)
          return (
            <group key={i} position={[x, y, z]}>
              {/* Outer cream halo ring */}
              <mesh>
                <sphereGeometry args={[0.048, 10, 10]} />
                <meshBasicMaterial color="#F8F5E6" transparent opacity={0.14} depthWrite={false} />
              </mesh>
              {/* Orange border */}
              <mesh>
                <sphereGeometry args={[0.032, 10, 10]} />
                <meshBasicMaterial color="#E5501A" />
              </mesh>
              {/* Inner cream dot */}
              <mesh>
                <sphereGeometry args={[0.016, 10, 10]} />
                <meshBasicMaterial color="#F8F5E6" />
              </mesh>
              {/* Floating country label */}
              <Html
                occlude={[globeMeshRef]}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                <div className='caption-serif' style={{
                  transform: 'translate(14px, -50%)',
                  color: 'var(--color-orange)',
                  whiteSpace: 'nowrap',
                  background: 'var(--color-cream)',
                  padding: '2px 12px',
                  borderRadius: '20px',
                  fontSize: '16px',
                }}>
                  {o.name}
                </div>
              </Html>
            </group>
          )
        })}
      </group>
    </>
  )
}

export default function Globe3D({ rotRef, style }) {
  return (
    // Wrapper layout — occupe l'espace normal, overflow visible pour laisser déborder les effets
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'visible', ...style }}>
      {/* Canvas élargi : inset négatif = shadow/halo ne sont plus rognés */}
      <div style={{ position: 'absolute', inset: '-10%', pointerEvents: 'none' }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <GlobeScene rotRef={rotRef} />
        </Canvas>
      </div>
    </div>
  )
}
