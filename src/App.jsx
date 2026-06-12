import SidePipe      from './components/SidePipe'
import BackToTop     from './components/BackToTop'
import PageLoader    from './components/PageLoader'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import Experience    from './components/Experience'
import Coffees       from './components/Coffees'
import HorizSection  from './components/HorizSection'
import About         from './components/About'
import Footer        from './components/Footer'
import CustomCursor  from './components/CustomCursor'
import FilmGrain     from './components/FilmGrain'
import MarqueeStrip  from './components/MarqueeStrip'
import './styles/global-additions.css'

export default function App() {
  return (
    <div className="font-avant text-cream overflow-x-hidden relative">
      <SidePipe />
      <PageLoader />
      <FilmGrain />
      <CustomCursor />
      <BackToTop />
      <Navbar />
      <Hero />
      <MarqueeStrip variant="sand" />
      <Experience />
      <Coffees />
      <HorizSection />
      <About />
      <Footer />
    </div>
  )
}
