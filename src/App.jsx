import BackToTop     from './components/BackToTop'
import PageLoader    from './components/PageLoader'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import Experience    from './components/Experience'
import Coffees       from './components/Coffees'
import Quote         from './components/Quote'
import Origins       from './components/Origins'
import About         from './components/About'
import Footer        from './components/Footer'
import ScrollLine    from './components/ScrollLine'
import CustomCursor  from './components/CustomCursor'
import FilmGrain     from './components/FilmGrain'
import MarqueeStrip  from './components/MarqueeStrip'
import './styles/global-additions.css'

export default function App() {
  return (
    <div className="font-avant bg-forest text-cream overflow-x-hidden">
      <PageLoader />
      <FilmGrain />
      <CustomCursor />
      <BackToTop />
      <ScrollLine />
      <Navbar />
      <Hero />
      <MarqueeStrip variant="orange" />
      <Experience />
      <Coffees />
      <Quote />
      <MarqueeStrip variant="dark" />
      <Origins />
      <About />
      <Footer />
    </div>
  )
}
