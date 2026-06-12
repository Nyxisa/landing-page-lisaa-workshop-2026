import './MarqueeStrip.css'

const ITEMS = [
  'Where time slows down',
  'Specialty coffee',
  'Single origin',
  'Ethiopia · Colombia · Yemen',
  'Still',
  'Hand-poured',
  'Direct trade',
  'Paris, 2026',
]

const text = ITEMS.map(t => `${t}  ·  `).join('')

const VARIANTS = {
  dark:   { bg: '#292929',  color: 'rgba(248,245,230,0.35)', border: 'rgba(248,245,230,0.08)' },
  orange: { bg: '#E5501A',  color: 'rgba(248,245,230,0.9)',  border: 'transparent' },
  sand:   { bg: '#d4cab8',  color: 'rgba(255,255,255,0.9)',  border: 'transparent' },
}

export default function MarqueeStrip({ variant = 'dark' }) {
  const { bg, color, border } = VARIANTS[variant] ?? VARIANTS.dark

  return (
    <div
      className="relative overflow-hidden z-20"
      style={{
        height: 44,
        backgroundColor: bg,
        borderTop:    `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div className="marquee-track absolute flex items-center h-full whitespace-nowrap">
        {[0, 1].map(n => (
          <span
            key={n}
            className="font-avant font-bold uppercase inline-block px-2"
            style={{ fontSize: 10, letterSpacing: '0.28em', color }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
