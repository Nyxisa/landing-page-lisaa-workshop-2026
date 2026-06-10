const COLS = [
  {
    head: 'Navigate',
    links: ['Our story', 'The coffees', 'Origins', 'About', 'Journal'],
  },
  {
    head: 'Shop',
    links: ['Merch', 'Gift cards', 'Wholesale', 'Catering'],
  },
  {
    head: 'Connect',
    links: ['Instagram', 'Contact', 'Press', 'Careers', 'Developers', 'Resource library'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-deep px-12 pt-20 pb-0 overflow-hidden">

      {/* Links grid */}
      <div className="grid grid-cols-3 gap-12 mb-24">
        {COLS.map(col => (
          <div key={col.head}>
            <div className="text-[10px] font-avant tracking-[0.35em] uppercase
                            text-cream/30 mb-5">
              {col.head}
            </div>
            <ul className="space-y-3">
              {col.links.map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-cream/50 font-avant
                               hover:text-cream transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Large brand footer — intentionally bleeds off-screen */}
      <div className="border-t border-cream/8 pt-5 -mx-12">
        <div
          className="whitespace-nowrap leading-[0.82] tracking-tighter select-none pl-12"
          style={{ fontSize: 'clamp(90px, 15vw, 200px)' }}
        >
          <span className="font-avant font-black uppercase text-cream">STILL</span>
          <span className="font-serif italic text-cream/80"> coffee</span>
        </div>
      </div>

    </footer>
  )
}
