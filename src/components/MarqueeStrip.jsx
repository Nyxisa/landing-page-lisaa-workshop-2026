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

export default function MarqueeStrip({ variant = 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: 44,
        backgroundColor: isDark ? '#292929' : '#E5501A',
        borderTop:    `1px solid ${isDark ? 'rgba(248,245,230,0.08)' : 'transparent'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(248,245,230,0.08)' : 'transparent'}`,
      }}
    >
      <div className="marquee-track absolute flex items-center h-full whitespace-nowrap">
        {/* Double content for seamless loop */}
        {[0, 1].map(n => (
          <span
            key={n}
            className="font-avant font-bold uppercase inline-block px-2"
            style={{
              fontSize: 10,
              letterSpacing: '0.28em',
              color: isDark ? 'rgba(248,245,230,0.35)' : 'rgba(248,245,230,0.9)',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
