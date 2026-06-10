import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const COUNT = 420
const DRIFT = 0.00065
const ATTRACT_FORCE = 0.0055

function ParticleField({ mouseNDC }) {
  const pointsRef = useRef()

  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      positions[ix]     = (Math.random() - 0.5) * 13
      positions[ix + 1] = (Math.random() - 0.5) * 8
      positions[ix + 2] = (Math.random() - 0.5) * 2
      velocities[ix]     = (Math.random() - 0.5) * DRIFT
      velocities[ix + 1] = (Math.random() - 0.5) * DRIFT
    }
    return { positions, velocities }
  }, [])

  useFrame(({ camera, size }) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array

    const fovY  = (camera.fov * Math.PI) / 180 / 2
    const hHalf = camera.position.z * Math.tan(fovY)
    const wHalf = hHalf * (size.width / size.height)

    // 150px expressed in NDC units (screen-size-aware)
    const attractNDC = 300 / size.width

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const iy = ix + 1

      // drift
      pos[ix] += velocities[ix]
      pos[iy] += velocities[iy]

      // wrap
      const bx = wHalf + 0.8, by = hHalf + 0.5
      if (pos[ix] >  bx) pos[ix] = -bx
      if (pos[ix] < -bx) pos[ix] =  bx
      if (pos[iy] >  by) pos[iy] = -by
      if (pos[iy] < -by) pos[iy] =  by

      // mouse attraction (in NDC space)
      const pxNDC = pos[ix] / wHalf
      const pyNDC = pos[iy] / hHalf
      const dnx = mouseNDC.current.x - pxNDC
      const dny = mouseNDC.current.y - pyNDC
      const dNDC = Math.sqrt(dnx * dnx + dny * dny)

      if (dNDC < attractNDC && dNDC > 0.001) {
        const f = ((attractNDC - dNDC) / attractNDC) * ATTRACT_FORCE
        pos[ix] += dnx * wHalf * f
        pos[iy] += dny * hHalf * f
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#D4A97C"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function HeroParticles() {
  const mouseNDC = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouseNDC.current.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
        camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 5] }}
      >
        <ambientLight color="#FFD9A0" intensity={1.5} />
        <ParticleField mouseNDC={mouseNDC} />
      </Canvas>
    </div>
  )
}
