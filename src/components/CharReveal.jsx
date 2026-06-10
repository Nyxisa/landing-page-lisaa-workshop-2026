import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CharReveal({ children, as: Tag = 'h2', className }) {
  const ref = useRef()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const chars = el.querySelectorAll('.cr-char')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          color: 'transparent',
          webkitTextStrokeWidth: '1px',
          webkitTextStrokeColor: 'rgba(248,245,230,0.72)',
        },
        {
          color: '#F8F5E6',
          webkitTextStrokeColor: 'rgba(248,245,230,0)',
          stagger: 0.032,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const text = String(children)

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="cr-char"
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : undefined,
              willChange: 'color',
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </Tag>
  )
}
