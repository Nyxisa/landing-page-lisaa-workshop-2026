const CARDS = [
  {
    region:   'Colombia',
    origin:   'Huila',
    altitude: '1,600 – 2,100 m',
    harvest:  'Harvest: Mar – Jun',
    bg:       '#7A1E1E',
    text:     '#F2EDE3',
    style:    { transform: 'rotate(-7deg) translateY(18px)', zIndex: 10 },
  },
  {
    region:   'Ethiopia',
    origin:   'Yirgacheffe',
    altitude: '1,800 – 2,200 m',
    harvest:  'Harvest: Nov – Jan',
    bg:       '#E5501A',
    text:     '#F2EDE3',
    style:    { transform: 'rotate(-1.5deg) translateY(-8px) scale(1.05)', zIndex: 20 },
    featured: true,
  },
  {
    region:   'Yemen',
    origin:   'Mocha',
    altitude: '1,500 – 2,000 m',
    harvest:  'Harvest: Oct – Dec',
    bg:       '#C3DCF4',
    text:     '#192719',
    style:    { transform: 'rotate(5deg) translateY(12px)', zIndex: 10 },
  },
]

function Card({ card }) {
  return (
    <div
      className="coffee-card relative rounded-xl cursor-pointer flex-shrink-0"
      style={{ ...card.style, width: 210, height: 290, backgroundColor: card.bg }}
    >
      {/* Image placeholder */}
      <div className="mx-3 mt-3 rounded-lg overflow-hidden"
           style={{ height: 178, backgroundColor: 'rgba(0,0,0,0.12)' }}>
        <div className="w-full h-full"
             style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.15) 100%)' }} />
      </div>

      {/* Text */}
      <div className="px-4 pt-3" style={{ color: card.text }}>
        <div className="text-[10px] font-avant tracking-[0.3em] uppercase opacity-65">{card.origin}</div>
        <div className="font-avant font-bold text-[15px] mt-0.5">{card.region}</div>
        <div className="text-[11px] mt-2 opacity-55">Altitude {card.altitude}</div>
        <div className="text-[11px] opacity-45">{card.harvest}</div>
      </div>
    </div>
  )
}

export default function Coffees() {
  return (
    <section className="bg-deep px-12 py-24">

      <span className="text-[11px] font-avant tracking-[0.45em] uppercase text-orange">
        Coffees
      </span>

      {/* Cards + SVG ribbon */}
      <div className="relative mt-16 flex justify-center items-center gap-5">

        {/* Connecting ribbon — sits behind the cards */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 750 320"
          preserveAspectRatio="none"
        >
          <path
            d="M 130 200 C 260 120, 490 240, 620 175"
            fill="none"
            stroke="#F2EDE3"
            strokeWidth="1"
            strokeOpacity="0.18"
            strokeDasharray="5 7"
          />
        </svg>

        {CARDS.map((card, i) => <Card key={i} card={card} />)}
      </div>

    </section>
  )
}
