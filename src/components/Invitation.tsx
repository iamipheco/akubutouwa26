import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Reveal, maskImg } from './ui/Reveal'
import { useParallax } from '../hooks/useParallax'
import { useDesktop, useFinePointer } from '../hooks/useMedia'
import { clamp } from '../lib/motion'
import { COUPLE, FAMILIES, PHOTOS, VENUE } from '../data/event'

function SidePhoto({ side, speed, photo, alt }: { side: 'l' | 'r'; speed: number; photo: { src: string; w: number; h: number }; alt: string }) {
  const p = useParallax(speed)
  return (
    <motion.div ref={p.ref} className={`inv-side ${side}`} style={{ y: p.y }}>
      <Reveal as="figure" variant="mask">
        <motion.img variants={maskImg()} src={photo.src} width={photo.w} height={photo.h} alt={alt} loading="lazy" />
      </Reveal>
    </motion.div>
  )
}

/** The velvet card with the families' formal invitation; it unfolds, then each line rises in */
export function Invitation() {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const fine = useFinePointer()
  const tilt = desktop && fine && !reduce
  const stageRef = useRef<HTMLDivElement>(null)
  const rxT = useMotionValue(0)
  const ryT = useMotionValue(0)
  const rotateX = useSpring(rxT, { stiffness: 80, damping: 20 })
  const rotateY = useSpring(ryT, { stiffness: 80, damping: 20 })

  return (
    <section
      className="inv"
      id="invitation"
      onPointerMove={e => {
        if (!tilt || !stageRef.current) return
        const r = stageRef.current.getBoundingClientRect()
        ryT.set(clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1) * 6)
        rxT.set(clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1) * -4)
      }}
      onPointerLeave={() => {
        rxT.set(0)
        ryT.set(0)
      }}
    >
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" variant="fade" className="eyebrow">
            The invitation
          </Reveal>
        </div>
        <motion.div ref={stageRef} className="inv-stage" style={tilt ? { rotateX, rotateY, transformPerspective: 2200 } : undefined}>
          <SidePhoto side="l" speed={-0.12} photo={PHOTOS.gaze} alt="Chidimma looks up at Tochukwu, both in ivory" />
          <SidePhoto side="r" speed={0.1} photo={PHOTOS.bench} alt="The couple laughing on a garden bench in matching Akwete" />

          <Reveal as="article" variant="unfold" className="card">
            <svg className="card-svg" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <radialGradient id="velv" cx="50%" cy="36%" r="78%">
                  <stop offset="0" stopColor="#7a1a2e" />
                  <stop offset=".55" stopColor="#4c0e1c" />
                  <stop offset="1" stopColor="#2a0710" />
                </radialGradient>
                <linearGradient id="gst" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#9a7330" />
                  <stop offset=".3" stopColor="#f4dea0" />
                  <stop offset=".55" stopColor="#d6b05c" />
                  <stop offset=".8" stopColor="#f4dea0" />
                  <stop offset="1" stopColor="#9a7330" />
                </linearGradient>
              </defs>
              <path
                d="M0,18 Q8,18 8,10 L37,10 C44,10 45,1 50,1 C55,1 56,10 63,10 L92,10 Q92,18 100,18 L100,122 Q92,122 92,130 L63,130 C56,130 55,139 50,139 C45,139 44,130 37,130 L8,130 Q8,122 0,122 Z"
                fill="url(#velv)"
                stroke="url(#gst)"
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M4,20.5 Q11.5,20.5 11.5,13.5 L38,13.5 C44.5,13.5 45.5,5 50,5 C54.5,5 55.5,13.5 62,13.5 L88.5,13.5 Q88.5,20.5 96,20.5 L96,119.5 Q88.5,119.5 88.5,126.5 L62,126.5 C55.5,126.5 54.5,135 50,135 C45.5,135 44.5,126.5 38,126.5 L11.5,126.5 Q11.5,119.5 4,119.5 Z"
                fill="none"
                stroke="url(#gst)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                opacity=".8"
              />
            </svg>
            <div className="card-body">
              <Reveal as="p" delay={0.5} className="c-script">
                The families of
              </Reveal>
              <Reveal as="p" delay={0.6} className="c-caps">
                {FAMILIES.bride.parents.map(l => (
                  <span key={l}>{l}</span>
                ))}
              </Reveal>
              <Reveal as="p" delay={0.68} className="c-it">
                of {FAMILIES.bride.lga}
              </Reveal>
              <Reveal as="p" delay={0.76} className="c-script">
                and
              </Reveal>
              <Reveal as="p" delay={0.84} className="c-caps">
                {FAMILIES.groom.parents.map(l => (
                  <span key={l}>{l}</span>
                ))}
              </Reveal>
              <Reveal as="p" delay={0.92} className="c-it">
                of {FAMILIES.groom.lga}
              </Reveal>
              <Reveal as="p" delay={1} className="c-caps">
                Both in {FAMILIES.state}
              </Reveal>
              <Reveal as="p" delay={1.1} className="c-script">
                Cordially invite you to the
              </Reveal>
              <Reveal as="h2" variant="zoom" delay={1.2} className="c-title gold">
                Traditional Marriage
              </Reveal>
              <Reveal as="p" delay={1.3} className="c-it">
                of their children
              </Reveal>
              <Reveal as="p" delay={1.4} className="c-couple">
                <span>{COUPLE.bride.full}</span>
                <i>&amp;</i>
                <span>{COUPLE.groom.full}</span>
              </Reveal>
              <Reveal as="span" variant="zoom" delay={1.55} className="c-rule" />
              <Reveal delay={1.65} className="c-when">
                <span>
                  <b>Date</b> Saturday 26th December, 2026
                </span>
                <span>
                  <b>Time</b> 12pm
                </span>
                <span>
                  <b>Venue</b> {VENUE.name}
                </span>
              </Reveal>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
