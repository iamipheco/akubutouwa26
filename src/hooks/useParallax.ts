import { useCallback, useEffect, useRef } from 'react'
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

/**
 * Vertical parallax relative to the element's parent: the further the parent's centre
 * is from the viewport centre, the further the element is shifted (times `speed`).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed: number) {
  const ref = useRef<T>(null)
  const y = useMotionValue(0)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const update = useCallback(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent || reduce) return
    const r = parent.getBoundingClientRect()
    const vh = innerHeight
    if (r.bottom < -300 || r.top > vh + 300) return
    y.set((r.top + r.height / 2 - vh / 2) * speed)
  }, [reduce, speed, y])

  useMotionValueEvent(scrollY, 'change', update)
  useEffect(() => {
    update()
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [update])

  return { ref, y }
}
