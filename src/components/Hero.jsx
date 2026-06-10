import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// Deterministic bean positions — trig prevents re-randomisation on hot-reload
const BEANS = Array.from({ length: 17 }, (_, i) => ({
  id: i,
  pos: [
    Math.sin(i * 2.3999) * 5.6 + Math.cos(i * 1.7123) * 2.1,
    Math.cos(i * 1.8731) * 2.9 + Math.sin(i * 2.1097) * 1.3,
    Math.sin(i * 0.9730) * 2.5 - 0.6,
  ],
  rot: [i * 0.743, i * 1.267, i * 0.521],
  scale: 0.38 + (i % 7) * 0.13,
}))

function Bean({ pos, rot, scale }) {
  const ref = useRef()
  const iy = pos[1]
  const [spd, phase, rx, rz] = useMemo(() => [
    0.14 + scale * 0.28,
    (pos[0] + 3) * 0.53,
    (pos[2] - 1) * 0.0055,
    (pos[0] - 2) * 0.0075,
  ], [pos, scale])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = iy + Math.sin(t * spd + phase) * 0.32
    ref.current.rotation.x += rx
    ref.current.rotation.z += rz
  })

  return (
    <group ref={ref} position={pos} rotation={rot} scale={scale}>
      {/* Bean body — flattened ellipsoid */}
      <mesh scale={[1.38, 0.70, 0.88]}>
        <sphereGeometry args={[0.5, 28, 18]} />
        <meshStandardMaterial color="#4A2010" roughness={0.52} metalness={0.06} />
      </mesh>
      {/* Central groove */}
      <mesh position={[0, 0, 0.4]} scale={[0.052, 0.56, 0.14]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color="#1C0805" roughness={0.92} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#192719']} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[6, 9, 5]}  intensity={1.5} color="#FFD9A0" />
      <directionalLight position={[-5, -4, 4]} intensity={0.28} color="#A0C8E0" />
      {BEANS.map(b => <Bean key={b.id} {...b} />)}
    </>
  )
}

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">

      {/* Three.js layer */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 9.5], fov: 54 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Ink spill — right edge */}
      <div className="absolute right-0 top-0 w-[38%] h-full pointer-events-none">
        <svg viewBox="0 0 300 900" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M300 0 C235 120,320 230,268 360 C216 490,140 420,178 560
               C216 700,318 640,300 900 L400 900 L400 0Z"
            fill="#131F14"
          />
        </svg>
      </div>

      {/* Title — bottom-left, editorial */}
      <div className="absolute bottom-0 left-0 px-12 pb-14">
        <h1 className="leading-[0.88] tracking-tighter text-[clamp(72px,8.5vw,120px)]">
          <span
            className="still-ghost font-avant font-black uppercase text-cream"
            data-text="STILL"
          >STILL</span>
          <span className="font-serif italic text-cream"> coffee</span>
        </h1>
        <p className="font-serif italic text-cream/45 mt-4 text-lg tracking-wide">
          Where time slows down.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-12 flex flex-col items-center gap-3 opacity-25">
        <span className="text-[10px] font-avant tracking-[0.4em] uppercase text-cream">Scroll</span>
        <div className="w-px h-14 bg-cream" />
      </div>

    </section>
  )
}
