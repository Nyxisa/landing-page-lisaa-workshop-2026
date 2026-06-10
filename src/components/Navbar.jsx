export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 h-14
                    bg-deep/85 backdrop-blur-md border-b border-cream/5">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 group">
        <span className="w-4 h-4 rounded-full bg-orange block transition-transform group-hover:scale-110" />
        <span className="text-sm">
          <span className="font-avant font-bold uppercase tracking-widest">STILL</span>
          <span className="font-serif italic ml-1 text-cream/80"> coffee</span>
        </span>
      </a>

      {/* Links */}
      <div className="flex items-center gap-7">
        <a href="#"
           className="text-[11px] font-avant tracking-[0.25em] uppercase text-cream/55
                      hover:text-cream transition-colors duration-200">
          Our story
        </a>
        <a href="#"
           className="text-[11px] font-avant tracking-[0.25em] uppercase
                      border border-cream/30 text-cream/55
                      hover:border-cream/70 hover:text-cream
                      px-4 py-1.5 rounded-full transition-all duration-200">
          Merch
        </a>
        <a href="#"
           className="text-[11px] font-avant tracking-[0.2em] uppercase
                      bg-orange text-cream px-5 py-2 rounded-full
                      hover:bg-orange/85 transition-colors duration-200">
          Find your next coffee
        </a>
      </div>
    </nav>
  )
}
