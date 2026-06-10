export default function Quote() {
  return (
    <section className="bg-sky px-12 py-24 flex items-center gap-20">

      {/* Quote text */}
      <blockquote className="flex-1 font-serif italic text-forest
                             text-[clamp(26px,3.4vw,52px)] leading-[1.25] max-w-2xl">
        "The best cup of coffee is the one drunk in silence,
        in the presence of your inner peace."
      </blockquote>

      {/* Abstract still-life */}
      <div className="relative flex-shrink-0 w-72 h-64">
        {/* Stacked cream papers / polaroids */}
        {[
          { rot: -9,  tx: -10, ty: 15 },
          { rot:  2,  tx:  20, ty: 5  },
          { rot: 11,  tx:  52, ty: 20 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute bg-cream/75 rounded shadow-md"
            style={{
              width: 130,
              height: 164,
              transform: `rotate(${p.rot}deg) translate(${p.tx}px, ${p.ty}px)`,
              left: 20,
              top: 0,
            }}
          />
        ))}
        {/* Dark maroon circles — coffee cookie/biscuit motif */}
        {[
          { size: 88, left: 110, top: 62  },
          { size: 68, left: 164, top: 102 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-maroon"
            style={{ width: c.size, height: c.size, left: c.left, top: c.top }}
          />
        ))}
      </div>

    </section>
  )
}
