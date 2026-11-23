import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useFinePointer } from '../hooks/useMedia'

/**
 * Gold cursor for mouse users: a dot that tracks exactly and a ring that trails behind.
 * The ring grows over links and becomes a gold "View" disc over photos.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const on = fine && !reduce
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 })
  const [state, setState] = useState({ hide: true, view: false, link: false, down: false })

  useEffect(() => {
    if (!on) return
    const root = document.documentElement
    root.classList.add('has-cur')
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target instanceof Element ? e.target : null
      const view = !!t?.closest('.ph-btn,.inv-side figure')
      const link = !view && !!t?.closest('a,button,label,[role="button"],.seal')
      setState(s => (s.hide || s.view !== view || s.link !== link ? { ...s, hide: false, view, link } : s))
    }
    const hide = () => setState(s => ({ ...s, hide: true }))
    const down = () => setState(s => ({ ...s, down: true }))
    const up = () => setState(s => ({ ...s, down: false }))
    addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    addEventListener('blur', hide)
    addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    return () => {
      root.classList.remove('has-cur')
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      removeEventListener('blur', hide)
      removeEventListener('pointerdown', down)
      removeEventListener('pointerup', up)
    }
  }, [on, x, y])

  if (!on) return null
  const cls = ['cur', state.hide && 'hide', state.view && 'view', state.link && 'link', state.down && 'down'].filter(Boolean).join(' ')
  return (
    <div className={cls} aria-hidden="true">
      <motion.span className="cur-ring" style={{ x: rx, y: ry }}>
        <b>View</b>
      </motion.span>
      <motion.span className="cur-dot" style={{ x, y }} />
    </div>
  )
}
