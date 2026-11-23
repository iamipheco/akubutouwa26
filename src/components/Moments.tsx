import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { Reveal } from './ui/Reveal'
import { SplitHeading } from './ui/SplitHeading'
import { Arrow } from './ui/icons'
import { Lightbox, type LightboxHandle } from './Lightbox'
import { useMedia } from '../hooks/useMedia'
import { clamp, pad2 } from '../lib/motion'
import { GALLERY } from '../data/event'

/**
 * Desktop: the section pins and vertical scrolling drives the strip sideways
 * (it leans with scroll speed, each photo pans inside its frame).
 * Phones: a native swipe carousel with a live counter.
 */
export function Moments() {
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 900px) and (min-height: 560px)')
  const hOn = wide && !reduce

  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [hMax, setHMax] = useState(0)
  const [vh, setVh] = useState(0)
  const [idx, setIdx] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const lb = useRef<LightboxHandle>(null)

  /* measure the strip so the pinned section is exactly as tall as the sideways travel */
  useLayoutEffect(() => {
    const measure = () => {
      setVh(innerHeight)
      setHMax(hOn && trackRef.current ? Math.max(0, trackRef.current.offsetWidth - innerWidth) : 0)
    }
    measure()
    addEventListener('resize', measure)
    addEventListener('load', measure)
    return () => {
      removeEventListener('resize', measure)
      removeEventListener('load', measure)
    }
  }, [hOn])

  const { scrollYProgress, scrollY } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, p => (hOn ? -p * hMax : 0))
  const velocity = useVelocity(scrollY)
  const skewRaw = useTransform(velocity, v => (hOn ? clamp((-v / 60) * 0.05, -3.2, 3.2) : 0))
  const skewX = useSpring(skewRaw, { stiffness: 120, damping: 24 })

  /* progress bar: scroll progress on desktop, swipe position on phones */
  const bar = useMotionValue(0)

  const updateCounter = useCallback(() => {
    const mid = innerWidth / 2
    let best = 0
    let bd = Infinity
    btnRefs.current.forEach((b, i) => {
      if (!b) return
      const r = b.getBoundingClientRect()
      const d = Math.abs(r.left + r.width / 2 - mid)
      if (d < bd) {
        bd = d
        best = i
      }
    })
    setIdx(best)
  }, [])

  const panPhotos = useCallback(() => {
    const vw = innerWidth
    for (const b of btnRefs.current) {
      if (!b) continue
      const img = b.firstElementChild as HTMLElement | null
      if (!img) continue
      if (!hOn) {
        img.style.transform = ''
        continue
      }
      const br = b.getBoundingClientRect()
      if (br.right < -100 || br.left > vw + 100) continue
      const c = (br.left + br.width / 2 - vw / 2) / vw
      img.style.transform = `translate3d(${(c * -7).toFixed(2)}%,0,0) scale(1.16)`
    }
  }, [hOn])

  useMotionValueEvent(scrollYProgress, 'change', p => {
    if (!hOn) return
    bar.set(p)
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r || r.bottom < 0 || r.top > innerHeight) return
    updateCounter()
    panPhotos()
  })
  useEffect(() => {
    panPhotos()
    updateCounter()
  }, [panPhotos, updateCounter, hMax])

  const onTrackScroll = () => {
    if (hOn || !trackRef.current) return
    const t = trackRef.current
    bar.set(t.scrollLeft / (t.scrollWidth - t.clientWidth || 1))
    updateCounter()
  }

  return (
    <section className={`mo${hOn ? ' is-h' : ''}`} id="moments">
      <div ref={wrapRef} className={`h-wrap${hOn ? ' h-on' : ''}`} style={hOn ? { height: hMax + vh } : undefined}>
        <div className="h-sticky">
          <div className="wrap mo-head">
            <div className="sec-head">
              <Reveal as="p" variant="fade" className="eyebrow solo">
                Pre-wedding shoot
              </Reveal>
              <SplitHeading text="Our" accent="moments" />
            </div>
            <span className="mo-hint" aria-hidden="true">
              Keep scrolling <i />
            </span>
          </div>

          <motion.div ref={trackRef} className="h-track" style={hOn ? { x, skewX } : undefined} onScroll={onTrackScroll}>
            {GALLERY.map((p, i) => (
              <figure key={p.src} className={`ph ${i % 2 ? 'down' : 'up'}`} style={{ ['--ar' as string]: p.ar }}>
                <button
                  ref={el => {
                    btnRefs.current[i] = el
                  }}
                  className="ph-btn"
                  type="button"
                  aria-label={`Open photo: ${p.caption}`}
                  onClick={() => lb.current?.open(i)}
                  style={{ visibility: active === i ? 'hidden' : undefined }}
                >
                  <img src={p.src} width={p.w} height={p.h} alt={p.alt} loading="lazy" />
                </button>
                <figcaption>
                  <b>{pad2(i + 1)}</b>
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </motion.div>

          <div className="wrap mo-foot">
            <motion.span
              key={idx}
              className="mo-count"
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0.2, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {pad2(idx + 1)} <i>/ {pad2(GALLERY.length)}</i>
            </motion.span>
            <div className="h-prog" aria-hidden="true">
              <motion.i style={{ scaleX: bar }} />
            </div>
            <span className="mo-swipe" aria-hidden="true">
              Swipe <Arrow />
            </span>
          </div>
        </div>
      </div>

      <Lightbox ref={lb} thumbs={btnRefs} onActive={setActive} />
    </section>
  )
}
