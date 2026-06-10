export default function About() {
  return (
    <section className="bg-forest px-12 py-24">

      <span className="text-[11px] font-avant tracking-[0.45em] uppercase text-orange">
        About Still
      </span>

      <div className="mt-8 grid grid-cols-2 gap-20 items-start">

        {/* Text column */}
        <div>
          <h2 className="font-serif italic text-[clamp(36px,4.5vw,66px)]
                         leading-[1.1] text-cream mb-10">
            A lounge built on slowness.
          </h2>
          <div className="space-y-5 text-cream/50 text-[13px] leading-relaxed font-avant max-w-sm">
            <p>
              Still was born from a single conviction: that coffee deserves
              the same contemplative space as music, as light, as the ritual
              of a Sunday morning that never quite ends.
            </p>
            <p>
              We source directly from small-lot farmers in Ethiopia,
              Colombia and Yemen — people who have cultivated their craft
              for generations, in soils shaped by altitude and time.
            </p>
            <p>
              Each cup is prepared with the patience it deserves:
              hand-poured, precisely dosed, served without rush.
            </p>
            <p className="font-serif italic text-cream/75 text-[15px] pt-2">
              "We don't serve coffee. We offer a moment."
            </p>
          </div>
        </div>

        {/* Photo */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ aspectRatio: '4/3' }}
        >
          <div
            className="w-full h-full flex items-end p-8"
            style={{
              background: `
                linear-gradient(160deg,
                  #243527 0%,
                  #3D5240 40%,
                  #2A3C2D 70%,
                  #192719 100%)`,
            }}
          >
            {/* Atmospheric caption */}
            <span className="font-serif italic text-cream/18 text-sm">
              Still coffee — Paris, 2026
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
