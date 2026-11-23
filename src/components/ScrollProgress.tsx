import { motion, useScroll, useTransform } from 'motion/react'

/** A string of coral beads across the top that fills as you scroll */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const clipPath = useTransform(scrollYProgress, p => `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0)`)
  return (
    <div className="beadbar" aria-hidden="true">
      <motion.i style={{ clipPath }} />
    </div>
  )
}
