import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { animate, motion, useReducedMotion } from 'motion/react'
import { Close, Next, Prev } from './ui/icons'
import { useExperience } from '../lib/experience'
import { EASE } from '../lib/motion'
import { GALLERY } from '../data/event'

export type LightboxHandle = { open: (i: number) => void }

const E = EASE

/**
 * Full-screen photo viewer. The photo flies out of its thumbnail (FLIP) and back again on close;
 * arrows, keyboard and swipes step through the set.
 */
export function Lightbox({
  ref,
  thumbs,
  onActive,
}: {
  ref: Ref<LightboxHandle>
  thumbs: RefObject<(HTMLButtonElement | null)[]>
  onActive: (i: number | null) => void
}) {
  const reduce = useReducedMotion()
  const { lock } = useExperience()
  const [cur, setCur] = useState<number | null>(null)
  const [show, setShow] = useState(false)
  const img = useRef<HTMLImageElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const busy = useRef(false)
  const curRef = useRef<number | null>(null)

  const flipFrom = (thumb: HTMLElement, el: HTMLElement) => {
    const a = thumb.getBoundingClientRect()
    const b = el.getBoundingClientRect()
    return {
      x: a.left + a.width / 2 - (b.left + b.width / 2),
      y: a.top + a.height / 2 - (b.top + b.height / 2),
      scale: a.width / b.width,
    }
  }

  const decode = async () => {
    try {
      await img.current?.decode()
    } catch {
      /* show it anyway */
    }
  }

  const open = useCallback(
    async (i: number) => {
      if (busy.current || curRef.current !== null) return
      busy.current = true
      curRef.current = i
      flushSync(() => setCur(i))
      onActive(i)
      lock(true)
      const el = img.current
      const thumb = thumbs.current[i]
      if (!el || !thumb) return
      el.style.opacity = '0'
      await decode()
      el.style.opacity = ''
      setShow(true)
      const f = flipFrom(thumb, el)
      await animate(el, { x: [f.x, 0], y: [f.y, 0], scale: [f.scale, 1] }, { duration: reduce ? 0 : 0.76, ease: E })
      busy.current = false
      closeBtn.current?.focus({ preventScroll: true })
    },
    [lock, onActive, reduce, thumbs],
  )

  useImperativeHandle(ref, () => ({ open }), [open])

  const close = useCallback(async () => {
    const i = curRef.current
    if (i === null || busy.current) return
    busy.current = true
    setShow(false)
    const el = img.current
    const thumb = thumbs.current[i]
    if (el && thumb) {
      const f = flipFrom(thumb, el)
      await animate(el, { x: [0, f.x], y: [0, f.y], scale: [1, f.scale] }, { duration: reduce ? 0 : 0.56, ease: E })
    }
    curRef.current = null
    setCur(null)
    onActive(null)
    lock(false)
    busy.current = false
    thumb?.focus({ preventScroll: true })
  }, [lock, onActive, reduce, thumbs])

  const step = useCallback(
    async (d: number) => {
      const i = curRef.current
      const el = img.current
      if (i === null || !el || busy.current) return
      busy.current = true
      const next = (i + d + GALLERY.length) % GALLERY.length
      onActive(next)
      await animate(el, { opacity: [1, 0], x: [0, -d * 50] }, { duration: reduce ? 0 : 0.22, ease: 'easeIn' })
      curRef.current = next
      flushSync(() => setCur(next))
      await decode()
      await animate(el, { opacity: [0, 1], x: [d * 50, 0] }, { duration: reduce ? 0 : 0.48, ease: E })
      busy.current = false
    },
    [onActive, reduce],
  )

  useEffect(() => {
    if (cur === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [cur, close, step])

  const sx = useRef<number | null>(null)
  if (cur === null) return null
  const photo = GALLERY[cur]

  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onPointerDown={e => {
        sx.current = e.clientX
      }}
      onPointerUp={e => {
        if (sx.current === null) return
        const dx = e.clientX - sx.current
        sx.current = null
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
      }}
    >
      <motion.div className="lb-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.55, ease: E }} />
      <figure>
        <img ref={img} src={photo.src} width={photo.w} height={photo.h} alt={photo.alt} />
        <motion.figcaption initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.5, delay: show ? 0.3 : 0 }}>
          {photo.caption}
        </motion.figcaption>
      </figure>
      {(
        [
          ['lb-close', 'Close photo', Close, close],
          ['lb-prev', 'Previous photo', Prev, () => step(-1)],
          ['lb-next', 'Next photo', Next, () => step(1)],
        ] as const
      ).map(([cls, label, Icon, fn]) => (
        <motion.button
          key={cls}
          ref={cls === 'lb-close' ? closeBtn : undefined}
          className={`lb-btn ${cls}`}
          type="button"
          aria-label={label}
          onClick={fn}
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.4, delay: show ? 0.2 : 0 }}
        >
          <Icon />
        </motion.button>
      ))}
    </div>
  )
}
