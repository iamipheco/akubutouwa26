import { motion, type Variants } from 'motion/react'
import { EASE } from '../../lib/motion'
import { Ornament } from './Ornament'

const word: Variants = {
  hidden: { y: '108%' },
  show: (i: number) => ({ y: '0%', transition: { duration: 1.2, ease: EASE, delay: i * 0.07 } }),
}
const accent: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: '0.25em', scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: '0em',
    scale: 1,
    transition: { duration: 1.4, ease: EASE, delay: i * 0.07 + 0.12 },
  }),
}

/**
 * Section heading: plain words rise out of their own masks one after another,
 * the gold italic accent fades in from a blur, then a Uli ornament draws itself beneath.
 */
export function SplitHeading({ text, accent: accentText, ornament = true }: { text: string; accent?: string; ornament?: boolean }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <>
      <motion.h2
        className="h2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        aria-label={accentText ? `${text} ${accentText}` : text}
      >
        {words.map((w, i) => (
          <span key={i} aria-hidden="true">
            <span className="w">
              <motion.span custom={i} variants={word}>
                {w}
              </motion.span>
            </span>{' '}
          </span>
        ))}
        {accentText && (
          <motion.em custom={words.length} variants={accent} aria-hidden="true">
            {accentText}
          </motion.em>
        )}
      </motion.h2>
      {ornament && <Ornament />}
    </>
  )
}
