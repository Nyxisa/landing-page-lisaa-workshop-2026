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
    <footer className="bg-charcoal px-12 pt-20 pb-0 overflow-hidden">

      {/* Links grid */}
      <div className="grid grid-cols-3 gap-12 mb-24">
        {COLS.map(col => (
          <div key={col.head}>
            <h3 className="text-cream mb-5">
              {col.head}
            </h3>
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

      {/* Large brand footer — logo */}
      <div className="border-t border-cream/8 pt-5 -mx-12">
        <div className="pl-12">
          <img
            src="/logo-still-coffee.svg"
            alt="STILL coffee"
            style={{ height: 'clamp(90px, 15vw, 200px)', width: 'auto' }}
          />
        </div>
      </div>

    </footer>
  )
}
