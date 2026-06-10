import Navbar      from './components/Navbar'
import Hero        from './components/Hero'
import Experience  from './components/Experience'
import Coffees     from './components/Coffees'
import Quote       from './components/Quote'
import Origins     from './components/Origins'
import About       from './components/About'
import Footer      from './components/Footer'
import ScrollLine  from './components/ScrollLine'

export default function App() {
  return (
    <div className="font-avant bg-forest text-cream overflow-x-hidden">
      <ScrollLine />
      <Navbar />
      <Hero />
      <Experience />
      <Coffees />
      <Quote />
      <Origins />
      <About />
      <Footer />
    </div>
  )
}
