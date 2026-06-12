import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    title: 'Hand-poured',
    desc: 'Every cup prepared with patience. Never rushed, never automated, the water temperature and bloom timed by hand.',
    img: '/img/coffee-machine.webp',
    rotate: -6,
  },
  {
    n: '02',
    title: 'Origin-driven',
    desc: 'Each roast sourced directly from small-lot farmers in soils shaped by altitude, time, and generations of craft.',
    img: '/img/texture-mousse-brown.webp',
    rotate: 4,
  },
  {
    n: '03',
    title: 'Unhurried service',
    desc: 'We do not serve coffee to go. Still is a place to stay, to exhale, to let the cup dictate the pace of your afternoon.',
    img: '/img/mood-light.webp',
    rotate: -2,
  },
]

export default function Experience() {
  const sectionRef = useRef()
  const stepsRef   = useRef([])
  const imgRefs    = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-in
      const topChildren = Array.from(sectionRef.current.children).slice(1, 3)
      gsap.fromTo(
        topChildren,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0,
          duration: 0.85, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      )

      // Steps — pinned sequential reveal (scrub)
      const valid = stepsRef.current.filter(Boolean)
      gsap.set(valid, { opacity: 0, x: -48 })

      const stepTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: '+=480',
          scrub: 1,
        },
      })

      valid.forEach((el, i) => {
        stepTl.to(el, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, i * 0.28)
      })

      // Init hover images — invisible, pre-rotated
      imgRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, scale: 0.85, rotation: STEPS[i].rotate - 5, yPercent: -50 })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  function handleEnter(i) {
    imgRefs.current.forEach((el, j) => {
      if (!el) return
      gsap.killTweensOf(el)
      if (j === i) {
        gsap.to(el, { opacity: 1, scale: 1, rotation: STEPS[j].rotate, duration: 0.45, ease: 'power2.out' })
      } else {
        gsap.to(el, { opacity: 0, scale: 0.88, duration: 0.2, ease: 'power2.in' })
      }
    })
  }

  function handleLeave(i) {
    const el = imgRefs.current[i]
    if (!el) return
    gsap.killTweensOf(el)
    gsap.to(el, { opacity: 0, scale: 0.88, rotation: STEPS[i].rotate - 5, duration: 0.3, ease: 'power2.in' })
  }

  return (
    <section ref={sectionRef} id="experience" className="bg-maroon relative overflow-hidden scroll-mt-14">
      <div className="container py-24">

      <h3 className="text-sky/60">Experience</h3>

      <div className="mt-8 grid grid-cols-2 gap-16 items-end">
        <h2 className="text-sky">
          A single cup.
        </h2>
        <p className="body-text-m text-sky/55 pb-2">
          The ritual of stillness. Each cup at Still is a meditation,
          hand-poured, precisely dosed, served without rush.
          The water temperature, the grind, the bloom:
          every variable tuned to the origin.
        </p>
      </div>

      {/* Hover images — one per step, stacked, absolutely positioned */}
      {STEPS.map((s, i) => (
        <div
          key={`hi-${s.n}`}
          ref={el => { imgRefs.current[i] = el }}
          className="absolute pointer-events-none rounded-2xl overflow-hidden"
          style={{ right: '10%', top: '64%', width: 210, height: 270, zIndex: 20 }}
        >
          <img
            src={s.img}
            alt=""
            draggable={false}
            className="w-full h-full object-cover select-none"
          />
        </div>
      ))}

      <div className="mt-14 border-t border-sky/15">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            ref={el => { stepsRef.current[i] = el }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            className="relative flex items-center gap-10 py-7 pl-5 border-b border-sky/15
                       group cursor-default select-none"
          >
            {/* Hover indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sky
                            origin-top scale-y-0 group-hover:scale-y-100
                            transition-transform duration-300" />
            <span className="body-text-s text-sky/30 tabular-nums w-5 shrink-0
                             group-hover:text-sky group-hover:scale-110
                             transition-all duration-300">
              {s.n}
            </span>
            <h4 className="text-sky/65 group-hover:text-sky transition-colors duration-300 w-36 shrink-0">
              {s.title}
            </h4>
            <span className="body-text-m text-sky/40 leading-snug">{s.desc}</span>
          </div>
        ))}
      </div>

      </div>
    </section>
  )
}
