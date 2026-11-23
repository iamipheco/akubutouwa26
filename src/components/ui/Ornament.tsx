import { motion, type Variants } from 'motion/react'
import { EASE, EASE_IO } from '../../lib/motion'

const draw = (delay: number): Variants => ({
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 1.6, ease: EASE_IO, delay: 0.35 + delay } },
})
const dot: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE, delay: 1.65 } },
}

/** Uli-inspired line ornament: a diamond, two curls and fading rules, drawn on reveal */
export function Ornament() {
  return (
    <motion.svg
      className="orn"
      viewBox="0 0 220 24"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.path variants={draw(0)} d="M110 3.5l8.5 8.5-8.5 8.5-8.5-8.5z" />
      <motion.path variants={draw(0.2)} d="M110 8.6l3.4 3.4-3.4 3.4-3.4-3.4z" />
      <motion.path variants={draw(0.35)} d="M98 12c-5 0-6.5-6.5-11-6.5S81.5 12 85.5 12s3.6-3.4 1.2-3.4" />
      <motion.path variants={draw(0.35)} d="M122 12c5 0 6.5-6.5 11-6.5s5.5 6.5 1.5 6.5-3.6-3.4-1.2-3.4" />
      <motion.path className="ln" variants={draw(0.6)} d="M80 12H6" />
      <motion.path className="ln r" variants={draw(0.6)} d="M140 12h74" />
      <motion.circle variants={dot} cx="74" cy="17.5" r="1.3" style={{ originX: '74px', originY: '17.5px' }} />
      <motion.circle variants={dot} cx="146" cy="17.5" r="1.3" style={{ originX: '146px', originY: '17.5px' }} />
      <motion.circle variants={dot} cx="110" cy="12" r="1.2" style={{ originX: '110px', originY: '12px' }} />
    </motion.svg>
  )
}

/** Gradients the ornament's side rules fade through; rendered once per page */
export function OrnamentDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="orn-fade-l" gradientUnits="userSpaceOnUse" x1="80" y1="0" x2="6" y2="0">
          <stop offset="0" stopColor="#d6b05c" />
          <stop offset="1" stopColor="#d6b05c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="orn-fade-r" gradientUnits="userSpaceOnUse" x1="140" y1="0" x2="214" y2="0">
          <stop offset="0" stopColor="#d6b05c" />
          <stop offset="1" stopColor="#d6b05c" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
