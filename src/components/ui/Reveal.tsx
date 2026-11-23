import { motion, type HTMLMotionProps, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE, EASE_IO, type Bezier } from '../../lib/motion'

export type RevealVariant = 'up' | 'fade' | 'zoom' | 'unfold' | 'mask'

const build = (variant: RevealVariant, delay: number): Variants => {
  const t = (duration: number, ease: Bezier = EASE) => ({ duration, ease, delay })
  switch (variant) {
    case 'fade':
      return {
        hidden: { opacity: 0, filter: 'blur(8px)' },
        show: { opacity: 1, filter: 'blur(0px)', transition: { opacity: t(1.1), filter: t(1.1) } },
      }
    case 'zoom':
      return {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1, transition: { opacity: t(1.1), scale: t(1.4) } },
      }
    case 'unfold':
      return {
        hidden: { opacity: 0, rotateX: -68, y: 30, transformPerspective: 1800, originY: 0 },
        show: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 1800, originY: 0, transition: { opacity: t(1.1), rotateX: t(1.4), y: t(1.4) } },
      }
    case 'mask':
      return {
        hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
        show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { clipPath: t(1.5, EASE_IO) } },
      }
    default:
      return {
        hidden: { opacity: 0, y: 44 },
        show: { opacity: 1, y: 0, transition: { opacity: t(1.1), y: t(1.4) } },
      }
  }
}

/** Child image of a `mask` reveal: settles from a slight zoom as the curtain lifts */
export const maskImg = (delay = 0): Variants => ({
  hidden: { scale: 1.25 },
  show: { scale: 1, transition: { duration: 2.2, ease: EASE, delay } },
})

type Tag = 'div' | 'p' | 'span' | 'h2' | 'h3' | 'article' | 'figure' | 'section'

type Props = Omit<HTMLMotionProps<'div'>, 'children'> & {
  as?: Tag
  variant?: RevealVariant
  delay?: number
  amount?: number
  children?: ReactNode
}

/** Fades, lifts, zooms, unfolds or unmasks its content the first time it scrolls into view */
export function Reveal({ as = 'div', variant = 'up', delay = 0, amount = 0.1, children, ...rest }: Props) {
  const M = motion[as] as typeof motion.div
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      variants={build(variant, delay)}
      {...rest}
    >
      {children}
    </M>
  )
}
