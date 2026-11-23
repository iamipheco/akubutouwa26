import { useCallback, useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Clock, Envelope, Heart, Image, Pin } from './ui/icons'
import { EASE } from '../lib/motion'

const LINKS = [
  { id: 'invitation', label: 'Invite', Icon: Envelope },
  { id: 'countdown', label: 'Date', Icon: Clock },
  { id: 'moments', label: 'Photos', Icon: Image },
  { id: 'details', label: 'Venue', Icon: Pin },
  { id: 'rsvp', label: 'RSVP', Icon: Heart },
]

/** Floating section nav: appears after the hero; a gold pill glides to the section in view */
export function Dock() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const update = useCallback(() => {
    const hero = document.getElementById('top')
    setShow(scrollY.get() > (hero?.offsetHeight ?? 600) * 0.55)
    const half = innerHeight * 0.5
    let cur: string | null = null
    for (const l of LINKS) {
      const el = document.getElementById(l.id)
      if (el && el.getBoundingClientRect().top <= half) cur = l.id
    }
    setActive(cur)
  }, [scrollY])

  useMotionValueEvent(scrollY, 'change', update)
  useEffect(() => {
    update()
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [update])

  return (
    <nav className={`dock${show ? ' show' : ''}`} aria-label="Sections">
      {LINKS.map(({ id, label, Icon }) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : undefined} aria-current={active === id ? 'true' : undefined}>
          {active === id && <motion.span layoutId="dock-ind" className="dock-ind" transition={{ duration: 0.7, ease: EASE }} />}
          <Icon />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}
