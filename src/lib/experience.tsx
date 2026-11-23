import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { EASE_OUT_QUART } from './motion'

/**
 * The cover ("gate") drives the whole first impression:
 *  closed  → doors shut, page locked
 *  opening → seal cracks, doors swing, gold dust bursts
 *  gone    → gate fading out, page unlocked
 *  hidden  → gate removed from view
 * `intro` flips on part-way through opening and plays the hero entrance.
 */
export type GatePhase = 'closed' | 'opening' | 'gone' | 'hidden'

/** Deep links (…/#rsvp) and ?open skip the cover and land straight on the page */
const skipCover = () => typeof location !== 'undefined' && (location.hash.length > 1 || new URLSearchParams(location.search).has('open'))

type Burst = (x: number, y: number, n?: number) => void

type Experience = {
  phase: GatePhase
  intro: boolean
  resetting: boolean
  openGate: (origin?: { x: number; y: number }) => void
  replay: () => void
  lock: (on: boolean) => void
  goTo: (target: string | HTMLElement | null) => void
  burst: Burst
  registerBurst: (fn: Burst) => void
  toast: (msg: string) => void
  toastMsg: { id: number; text: string } | null
}

const Ctx = createContext<Experience | null>(null)

export function useExperience() {
  const c = use(Ctx)
  if (!c) throw new Error('useExperience must be used inside <ExperienceProvider>')
  return c
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() ?? false
  const lenis = useLenis()
  const [skip] = useState(skipCover)
  const [phase, setPhase] = useState<GatePhase>(skip ? 'hidden' : 'closed')
  const [intro, setIntro] = useState(skip)
  const [resetting, setResetting] = useState(false)
  const [toastMsg, setToastMsg] = useState<Experience['toastMsg']>(null)
  const burstRef = useRef<Burst>(() => {})
  const timers = useRef<number[]>([])
  const lockedRef = useRef(!skip)

  const lock = useCallback(
    (on: boolean) => {
      lockedRef.current = on
      document.documentElement.classList.toggle('locked', on)
      if (lenis) on ? lenis.stop() : lenis.start()
    },
    [lenis],
  )

  // keep Lenis in step with the lock once it exists
  useEffect(() => {
    lock(lockedRef.current)
  }, [lock])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const burst = useCallback<Burst>((x, y, n) => burstRef.current(x, y, n), [])
  const registerBurst = useCallback((fn: Burst) => {
    burstRef.current = fn
  }, [])

  const openGate = useCallback(
    (origin?: { x: number; y: number }) => {
      if (phase !== 'closed') return
      setPhase('opening')
      if (origin) later(() => burst(origin.x, origin.y, 190), reduce ? 0 : 140)
      later(() => setIntro(true), reduce ? 0 : 1050)
      later(() => {
        setPhase('gone')
        lock(false)
      }, reduce ? 200 : 1950)
      later(() => setPhase('hidden'), reduce ? 500 : 2700)
    },
    [burst, lock, phase, reduce],
  )

  const replay = useCallback(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    setResetting(true)
    setPhase('closed')
    setIntro(false)
    lock(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setResetting(false)))
  }, [lenis, lock])

  const goTo = useCallback(
    (target: string | HTMLElement | null) => {
      const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target
      if (!el) return
      if (lenis && !reduce) lenis.scrollTo(el, { duration: 1.7, easing: EASE_OUT_QUART })
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    },
    [lenis, reduce],
  )

  useEffect(() => {
    if (!skip || !location.hash) return
    const t = setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 120)
    return () => clearTimeout(t)
  }, [skip])

  // in-page anchors glide instead of jumping
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const el = id ? document.getElementById(id) : null
      if (!el) return
      e.preventDefault()
      goTo(el)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [goTo])

  const toastTimer = useRef<number>(0)
  const toast = useCallback((text: string) => {
    setToastMsg({ id: Date.now(), text })
    clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600)
  }, [])

  const value = useMemo<Experience>(
    () => ({ phase, intro, resetting, openGate, replay, lock, goTo, burst, registerBurst, toast, toastMsg }),
    [phase, intro, resetting, openGate, replay, lock, goTo, burst, registerBurst, toast, toastMsg],
  )

  return <Ctx value={value}>{children}</Ctx>
}

/** Copies the hashtag, falling back to selecting it when the clipboard is unavailable */
export function useCopy() {
  const { toast } = useExperience()
  return useCallback(
    async (text: string, selectEl?: HTMLElement | null) => {
      try {
        await navigator.clipboard.writeText(text)
        toast(`Copied ${text}`)
      } catch {
        if (selectEl) {
          const r = document.createRange()
          r.selectNodeContents(selectEl)
          const s = getSelection()
          s?.removeAllRanges()
          s?.addRange(r)
        }
        toast('Hashtag selected, copy it from there')
      }
    },
    [toast],
  )
}
