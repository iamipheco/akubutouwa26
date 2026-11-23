import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'motion/react'
import { useExperience } from '../lib/experience'
import { useDesktop, useFinePointer } from '../hooks/useMedia'
import { useParallax } from '../hooks/useParallax'
import { EASE, EASE_IO, clamp } from '../lib/motion'
import { COUPLE, HASHTAG, HERO_SLIDES, PHOTOS, VENUE } from '../data/event'
import { MagneticLink } from './ui/Magnetic'

const E = EASE
const EIO = EASE_IO

/** Entrance for small hero pieces: rise out of a blur, `t` seconds after the gate opens */
function Intro({ t, as = 'p', children, ...rest }: { t: number; as?: 'p' | 'div' | 'span' | 'ul'; children: ReactNode } & HTMLMotionProps<'p'>) {
  const { intro } = useExperience()
  const M = motion[as] as typeof motion.p
  return (
    <M
      initial={false}
      animate={intro ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 34, filter: 'blur(10px)' }}
      transition={{ opacity: { duration: 1.1, ease: E, delay: t }, y: { duration: 1.4, ease: E, delay: t }, filter: { duration: 1.1, ease: E, delay: t } }}
      {...rest}
    >
      {children}
    </M>
  )
}

const WIPE_FROM = 'polygon(-12% -40%, -12% -40%, -12% 140%, -12% 140%)'
const WIPE_TO = 'polygon(-12% -40%, 112% -40%, 112% 140%, -12% 140%)'

/** A name written in by a wipe from left to right */
function Name({ t, className, children }: { t: number; className: string; children: ReactNode }) {
  const { intro } = useExperience()
  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={false}
      animate={intro ? { clipPath: WIPE_TO, x: '0em', filter: 'blur(0px)' } : { clipPath: WIPE_FROM, x: '-0.15em', filter: 'blur(6px)' }}
      transition={{ clipPath: { duration: 2, ease: EIO, delay: t }, x: { duration: 2.2, ease: E, delay: t }, filter: { duration: 1.6, ease: E, delay: t } }}
    >
      {children}
    </motion.span>
  )
}

export function Hero() {
  const { intro } = useExperience()
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const fine = useFinePointer()
  const sectionRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  /* parallax layers */
  const bg = useParallax(0.16)
  const photo = useParallax(-0.07)
  const inset = useParallax(0.08)

  /* cross-fading portraits: pause when off screen or the tab is hidden */
  const [slide, setSlide] = useState(0)
  const boxInView = useInView(boxRef)
  useEffect(() => {
    if (reduce || !intro || !boxInView) return
    const id = setInterval(() => {
      if (!document.hidden) setSlide(s => (s + 1) % HERO_SLIDES.length)
    }, 5200)
    return () => clearInterval(id)
  }, [reduce, intro, boxInView])

  /* the layered photo leans toward the pointer (desktop) */
  const tilt = desktop && fine && !reduce
  const rxT = useMotionValue(0)
  const ryT = useMotionValue(0)
  const rotateX = useSpring(rxT, { stiffness: 90, damping: 20 })
  const rotateY = useSpring(ryT, { stiffness: 90, damping: 20 })
  const frameRef = useRef<HTMLDivElement>(null)

  /* as you scroll away the hero content drifts down and dims (desktop) */
  const { scrollY } = useScroll()
  const exitK = useTransform(scrollY, v => {
    const h = sectionRef.current?.offsetHeight || 1
    return clamp((v / h - 0.15) / 0.85, 0, 1)
  })
  const exitY = useTransform(exitK, k => k * 110)
  const exitO = useTransform(exitK, k => 1 - k * 0.75)
  const exit = desktop && !reduce

  return (
    <section
      ref={sectionRef}
      id="top"
      className={`hero${intro ? '' : ' is-pre'}`}
      onPointerMove={e => {
        if (!tilt || !frameRef.current) return
        const r = frameRef.current.getBoundingClientRect()
        ryT.set(clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2), -1, 1) * 7)
        rxT.set(clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2), -1, 1) * -5)
      }}
      onPointerLeave={() => {
        rxT.set(0)
        ryT.set(0)
      }}
    >
      <motion.div
        className="hero-bg"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: intro ? 1 : 0 }}
        transition={{ duration: 2.2, ease: E, delay: 0.05 }}
      >
        <motion.div ref={bg.ref} className="hero-bg-par" style={{ y: bg.y }}>
          <img src={PHOTOS.bench.src} width={PHOTOS.bench.w} height={PHOTOS.bench.h} alt="" fetchPriority="high" />
        </motion.div>
      </motion.div>

      <motion.div className="wrap hero-grid" style={exit ? { y: exitY, opacity: exitO } : undefined}>
        <div className="hero-head">
          <Intro t={0} className="hero-tag">
            {HASHTAG}
          </Intro>
          <Intro t={0.1} className="eyebrow solo">
            Igba Nkwu · Traditional Marriage
          </Intro>
          <h1 className="hero-names" aria-label={`${COUPLE.bride.first} and ${COUPLE.groom.first}`}>
            <Name t={0.2} className="nm gold">
              {COUPLE.bride.first}
            </Name>
            <Intro as="span" t={0.95} className="amp" aria-hidden="true">
              &amp;
            </Intro>
            <Name t={0.6} className="nm nm2 gold">
              {COUPLE.groom.first}
            </Name>
          </h1>
        </div>

        <motion.div ref={frameRef} className="frame" style={tilt ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}>
          <motion.div
            ref={boxRef}
            className="frame-box"
            initial={false}
            animate={{ clipPath: intro ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 1.9, ease: EIO, delay: 0.1 }}
          >
            <motion.div ref={photo.ref} className="frame-par" style={{ y: photo.y }}>
              {HERO_SLIDES.map((p, i) => (
                <motion.img
                  key={p.src}
                  src={p.src}
                  width={p.w}
                  height={p.h}
                  alt={i === 0 ? p.alt : ''}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  initial={false}
                  animate={{ opacity: i === slide ? 1 : 0, scale: !intro ? 1.3 : i === slide ? 1 : 1.07 }}
                  transition={{ opacity: { duration: 1.8, ease: 'easeInOut' }, scale: { duration: 7, ease: [0.2, 0.6, 0.2, 1] } }}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="badge"
            aria-hidden="true"
            style={{ z: desktop ? 70 : 0 }}
            initial={false}
            animate={intro ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.2, rotate: -120, opacity: 0 }}
            transition={{ scale: { duration: 1.4, ease: E, delay: 1.35 }, rotate: { duration: 1.4, ease: E, delay: 1.35 }, opacity: { duration: 0.8, delay: 1.35 } }}
          >
            <svg viewBox="0 0 120 120">
              <defs>
                <path id="badge-c" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
              </defs>
              <text>
                <textPath href="#badge-c" textLength="292" lengthAdjust="spacing">
                  #AKUBUTOUWA26 ◆ 26 · 12 · 2026 ◆{' '}
                </textPath>
              </text>
            </svg>
            <b>{COUPLE.monogram}</b>
          </motion.div>

          <motion.div
            className="hero-inset"
            aria-hidden="true"
            style={{ z: 50 }}
            initial={false}
            animate={intro ? { clipPath: 'inset(0% 0% 0% 0% round 6px)', y: 0 } : { clipPath: 'inset(100% 0% 0% 0% round 6px)', y: 40 }}
            transition={{ clipPath: { duration: 1.7, ease: EIO, delay: 1 }, y: { duration: 1.9, ease: E, delay: 1 } }}
          >
            <motion.div ref={inset.ref} className="hero-inset-par" style={{ y: inset.y }}>
              <img src={PHOTOS.hand.src} width={PHOTOS.hand.w} height={PHOTOS.hand.h} alt="" loading="lazy" />
            </motion.div>
          </motion.div>

          <motion.span
            className="hero-vert"
            aria-hidden="true"
            initial={false}
            animate={intro ? { opacity: 1, letterSpacing: '0.42em' } : { opacity: 0, letterSpacing: '0.1em' }}
            transition={{ opacity: { duration: 1.2, delay: 1.6 }, letterSpacing: { duration: 1.8, ease: E, delay: 1.6 } }}
          >
            Saturday · 26 · 12 · 2026
          </motion.span>
        </motion.div>

        <div className="hero-body">
          <Intro as="div" t={1.05} className="hero-date" role="group" aria-label={`Saturday 26 December 2026, 12 noon, ${VENUE.short}`}>
            <span className="hd-m" aria-hidden="true">
              December
            </span>
            <div className="hd-row" aria-hidden="true">
              <span>Saturday</span>
              <b>26</b>
              <span>12 noon</span>
            </div>
            <span className="hd-m" aria-hidden="true">
              2026
            </span>
            <span className="hd-v" aria-hidden="true">
              {VENUE.short}
            </span>
          </Intro>
          <Intro t={1.05} className="hero-lede">
            The Ononye and Nzekwesi families of Idemili North invite you to celebrate the traditional marriage of their children.
          </Intro>
          <Intro as="ul" t={1.2} className="hero-meta">
            <li>Sat 26 Dec 2026</li>
            <li>12 noon</li>
            <li>{VENUE.name}</li>
          </Intro>
          <Intro as="div" t={1.35} className="hero-cta">
            <MagneticLink className="btn btn-gold" href="#rsvp">
              RSVP
            </MagneticLink>
            <MagneticLink className="btn btn-ghost" href="#invitation">
              Read the invitation
            </MagneticLink>
          </Intro>
        </div>
      </motion.div>
    </section>
  )
}
