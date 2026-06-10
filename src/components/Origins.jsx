const PINS = [
  { name: 'Colombia', x: 26, y: 60 },
  { name: 'Ethiopia', x: 59, y: 54 },
  { name: 'Yemen',    x: 68, y: 41 },
]

export default function Origins() {
  return (
    <section className="bg-forest px-12 py-24">

      <span className="text-[11px] font-avant tracking-[0.45em] uppercase text-orange">
        Origins
      </span>

      <div className="mt-16 flex justify-center">
        {/* Globe — layered rings */}
        <div className="relative" style={{ width: 380, height: 380 }}>

          {/* Atmosphere rings */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-sand/10"
              style={{ margin: i * 22 }}
            />
          ))}

          {/* Globe fill */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 38% 38%, #3D5240 0%, #243527 55%, #192719 100%)',
              border: '1px solid rgba(212,202,184,0.15)',
            }}
          />

          {/* Latitude lines — subtle */}
          {[30, 50, 70].map(pct => (
            <div
              key={pct}
              className="absolute border-t border-sand/8 rounded-full"
              style={{
                left: `${(100 - pct) / 2}%`,
                right: `${(100 - pct) / 2}%`,
                top: `${pct}%`,
              }}
            />
          ))}

          {/* Location pins */}
          {PINS.map(pin => (
            <div
              key={pin.name}
              className="absolute group cursor-pointer"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              {/* Pulse ring */}
              <span className="absolute -inset-2 rounded-full bg-orange/20
                               scale-0 group-hover:scale-100 transition-transform duration-300" />
              {/* Dot */}
              <span className="block w-2 h-2 rounded-full bg-orange
                               -translate-x-1 -translate-y-1 relative z-10" />
              {/* Label */}
              <div className="absolute left-3.5 -top-3 flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-4 h-px bg-cream/25" />
                <span className="text-[11px] font-avant tracking-[0.2em] uppercase text-cream/50
                                 group-hover:text-cream/90 transition-colors duration-200">
                  {pin.name}
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>

    </section>
  )
}
