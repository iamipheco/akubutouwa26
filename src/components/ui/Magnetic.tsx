import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'motion/react'
import { useFinePointer } from '../../hooks/useMedia'

/** A link that leans toward the pointer while it hovers (desktop only) */
export function MagneticLink({ children, ...rest }: HTMLMotionProps<'a'>) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const active = fine && !reduce
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 })

  return (
    <motion.a
      {...rest}
      style={active ? { x, y } : undefined}
      onPointerMove={e => {
        if (!active) return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left - r.width / 2) * 0.22)
        my.set((e.clientY - r.top - r.height / 2) * 0.32)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {children}
    </motion.a>
  )
}
