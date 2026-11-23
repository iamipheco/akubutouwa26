import { useRef } from 'react'
import { motion, type Variants } from 'motion/react'
import { Reveal } from './ui/Reveal'
import { Copy } from './ui/icons'
import { useCopy, useExperience } from '../lib/experience'
import { useParallax } from '../hooks/useParallax'
import { EASE, EASE_IO } from '../lib/motion'
import { COUPLE, HASHTAG, PHOTOS } from '../data/event'

const wipe = (delay: number): Variants => ({
  hidden: { clipPath: 'polygon(-12% -40%, -12% -40%, -12% 140%, -12% 140%)' },
  show: { clipPath: 'polygon(-12% -40%, 112% -40%, 112% 140%, -12% 140%)', transition: { duration: 2.1, ease: EASE_IO, delay } },
})
const amp: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 0.8 } } }

/** Closing: the couple's names write themselves in over a wine-toned portrait */
export function Footer() {
  const { replay } = useExperience()
  const copy = useCopy()
  const tagRef = useRef<HTMLSpanElement>(null)
  const bg = useParallax(0.12)

  return (
    <footer className="ft">
      <div className="ft-bg" aria-hidden="true">
        <motion.div ref={bg.ref} className="ft-bg-par" style={{ y: bg.y }}>
          <img src={PHOTOS.gaze.src} width={PHOTOS.gaze.w} height={PHOTOS.gaze.h} alt="" loading="lazy" />
        </motion.div>
      </div>
      <div className="wrap ft-in">
        <Reveal as="p" variant="fade" className="eyebrow ft-eb">
          With gratitude
        </Reveal>
        <Reveal as="h2" className="ft-names" aria-label={`${COUPLE.bride.first} and ${COUPLE.groom.first}`}>
          <motion.span className="gold" aria-hidden="true" variants={wipe(0.25)}>
            {COUPLE.bride.first}
          </motion.span>{' '}
          <motion.i aria-hidden="true" variants={amp}>
            &amp;
          </motion.i>{' '}
          <motion.span className="gold" aria-hidden="true" variants={wipe(1)}>
            {COUPLE.groom.first}
          </motion.span>
        </Reveal>
        <Reveal as="p" className="ft-thanks" delay={0.09}>
          Thank you for celebrating with us.
        </Reveal>
        <Reveal as="p" variant="fade" className="ft-date" delay={0.18}>
          26 · 12 · 2026
        </Reveal>
        <Reveal className="ft-tag" delay={0.27}>
          <span ref={tagRef}>{HASHTAG}</span>
          <motion.button
            className="icon-btn"
            type="button"
            aria-label="Copy the hashtag"
            onClick={() => copy(HASHTAG, tagRef.current)}
            whileTap={{ scale: 0.9 }}
            transition={{ ease: EASE }}
          >
            <Copy />
          </motion.button>
        </Reveal>
        <button className="ft-replay" type="button" onClick={replay}>
          Close the invitation
        </button>
      </div>
    </footer>
  )
}
