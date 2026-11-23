import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal } from './ui/Reveal'
import { SplitHeading } from './ui/SplitHeading'
import { useParallax } from '../hooks/useParallax'
import { EASE } from '../lib/motion'
import { EVENT_START, PHOTOS, VENUE } from '../data/event'

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/** One odometer digit: a 0–9 strip that rolls to the value and blurs while it moves */
function Digit({ value, first, delay }: { value: number; first: boolean; delay: number }) {
  const reduce = useReducedMotion()
  const strip = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current !== value && strip.current && !reduce && !first) {
      animate(strip.current, { filter: ['blur(0px)', 'blur(1.6px)', 'blur(0px)'] }, { duration: 0.8, times: [0, 0.45, 1] })
    }
    prev.current = value
  }, [value, reduce, first])
  return (
    <span className="dg">
      <motion.span
        ref={strip}
        className="strip"
        initial={false}
        animate={{ y: `${-value}em` }}
        transition={{ duration: first ? 2.2 : 0.85, ease: EASE, delay: first ? delay : 0 }}
      >
        {DIGITS.map(d => (
          <span key={d}>{d}</span>
        ))}
      </motion.span>
    </span>
  )
}

function Num({ value, first, delay }: { value: number; first: boolean; delay: number }) {
  const s = String(value).padStart(2, '0')
  return (
    <div className="cd-num" aria-hidden="true">
      {s.split('').map((c, i) => (
        <Digit key={s.length - i} value={Number(c)} first={first} delay={delay} />
      ))}
    </div>
  )
}

function remaining() {
  const ms = Math.max(0, EVENT_START - Date.now())
  return { ms, d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 }
}

/** Live countdown to 12:00 WAT; the digits sit at zero until the section is seen, then roll up */
export function Countdown() {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.35 })
  const reduce = useReducedMotion()
  const live = seen || !!reduce
  const [t, setT] = useState(remaining)
  const [first, setFirst] = useState(true)
  const bg = useParallax(0.12)

  useEffect(() => {
    const id = setInterval(() => setT(remaining()), 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (!live) return
    const id = setTimeout(() => setFirst(false), 2800)
    return () => clearTimeout(id)
  }, [live])

  const units = [
    { k: 'd', label: 'Days', v: t.d },
    { k: 'h', label: 'Hours', v: t.h },
    { k: 'm', label: 'Minutes', v: t.m },
    { k: 's', label: 'Seconds', v: t.s },
  ] as const

  return (
    <section ref={ref} className="cd" id="countdown">
      <motion.div ref={bg.ref} className="cd-bg" style={{ y: bg.y }}>
        <img src={PHOTOS.foliage.src} width={PHOTOS.foliage.w} height={PHOTOS.foliage.h} alt="" loading="lazy" />
      </motion.div>
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" variant="fade" className="eyebrow">
            Counting down
          </Reveal>
          <SplitHeading text="Days until" accent="Igba Nkwu" />
        </div>
        <Reveal className="cd-grid" role="timer">
          {units.map((u, i) => (
            <div className="cd-unit" key={u.k}>
              <Num value={live ? u.v : 0} first={first} delay={i * 0.12} />
              <span className="cd-lbl">{u.label}</span>
            </div>
          ))}
          <span className="sr">{`${t.d} days, ${t.h} hours and ${t.m} minutes until the traditional marriage`}</span>
        </Reveal>
        <Reveal as="p" variant="fade" className="cd-note">
          {t.ms === 0
            ? `Today is the day. We will see you at ${VENUE.name}.`
            : `Saturday 26 December 2026 · 12 noon, West Africa Time · ${VENUE.name}`}
        </Reveal>
      </div>
    </section>
  )
}
