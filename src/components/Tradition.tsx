import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { Reveal } from './ui/Reveal'
import { SplitHeading } from './ui/SplitHeading'
import { clamp } from '../lib/motion'
import { TRADITION } from '../data/event'

/**
 * Scrollytelling: a gold line fills as you read; the step in focus lights up and,
 * on desktop, its photo wipes up over the last one in the pinned frame.
 */
export function Tradition() {
  const listRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  const fill = useMotionValue(0)
  const { scrollY } = useScroll()

  const update = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const vh = innerHeight
    const r = list.getBoundingClientRect()
    fill.set(clamp((vh * 0.55 - r.top) / r.height, 0, 1))
    if (r.bottom < -200 || r.top > vh + 200) return
    let a = 0
    stepRefs.current.forEach((s, i) => {
      if (!s) return
      const b = s.getBoundingClientRect()
      if (b.top + b.height * 0.5 < vh * 0.62) a = i
    })
    setActive(a)
  }, [fill])

  useMotionValueEvent(scrollY, 'change', update)
  useEffect(() => {
    update()
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [update])

  return (
    <section className="tr" id="tradition">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="p" variant="fade" className="eyebrow solo">
            The tradition
          </Reveal>
          <SplitHeading text="What happens at an" accent="Igba Nkwu" />
          <Reveal as="p" className="lede">
            Igba Nkwu means “wine carrying”. It is the Igbo traditional marriage, and a cup of palm wine sits at the heart of it.
          </Reveal>
        </div>
        <div className="tr-grid">
          <div className="tr-media" aria-hidden="true">
            {TRADITION.map((s, i) => (
              <div key={s.n} className={`tr-img${i <= active ? ' on' : ''}`} style={{ zIndex: i + 1 }}>
                <img src={s.photo.src} width={s.photo.w} height={s.photo.h} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="tr-steps" ref={listRef}>
            <span className="tr-line" aria-hidden="true">
              <motion.i style={{ scaleY: fill }} />
            </span>
            <ol>
              {TRADITION.map((s, i) => (
                <li
                  key={s.n}
                  ref={el => {
                    stepRefs.current[i] = el
                  }}
                  className={`step${i === active ? ' on' : ''}`}
                >
                  <img className="step-img" src={s.photo.src} width={s.photo.w} height={s.photo.h} alt="" loading="lazy" />
                  <span className="step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
