import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useVelocity } from 'motion/react'
import { COUPLE, HASHTAG, VENUE } from '../data/event'

const Group = () => (
  <span className="mq-item">
    <span className="script">
      {COUPLE.bride.first} &amp; {COUPLE.groom.first}
    </span>
    <i />
    Igba Nkwu
    <i />
    26 · 12 · 2026
    <i />
    {VENUE.name}
    <i />
    {HASHTAG}
    <i />
  </span>
)

/** Akwete-bordered marquee; scrolling speeds it up and flips its direction */
export function Ribbon() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const x = useMotionValue('0%')
  const pos = useRef(0)
  const rate = useRef(1)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const v = velocity.get() / 60 // px per frame, as the prototype measured it
    if (Math.abs(v) > 0.5) dir.current = v < 0 ? -1 : 1
    const target = dir.current * (1 + Math.min(Math.abs(v) * 0.45, 9))
    rate.current += (target - rate.current) * 0.06
    pos.current = (((pos.current + (delta / 52000) * rate.current) % 1) + 1) % 1
    x.set(`${(-pos.current * 50).toFixed(3)}%`)
  })

  return (
    <div className="ribbon" aria-hidden="true">
      <div className="mq">
        <motion.div className="mq-track" style={{ x }}>
          <Group />
          <Group />
          <Group />
          <Group />
        </motion.div>
      </div>
    </div>
  )
}
