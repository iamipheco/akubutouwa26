import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useExperience } from '../lib/experience'

type Mote = { x: number; y: number; r: number; vy: number; ph: number; sp: number; a: number }
type Spark = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number }

/** Ambient gold motes drifting up the screen, plus bursts when the seal breaks or an RSVP lands */
export function GoldDust() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const { registerBurst } = useExperience()

  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    let W = 0
    let H = 0
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = innerWidth
      H = innerHeight
      c.width = W * dpr
      c.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    addEventListener('resize', size)

    const mk = (init: boolean): Mote => ({
      x: Math.random() * W,
      y: init ? Math.random() * H : H + 10,
      r: Math.random() * 1.5 + 0.4,
      vy: -(Math.random() * 0.22 + 0.06),
      ph: Math.random() * 6.28,
      sp: Math.random() * 0.02 + 0.006,
      a: Math.random() * 0.5 + 0.25,
    })
    const amb: Mote[] = reduce ? [] : Array.from({ length: 30 }, () => mk(true))
    const fx: Spark[] = []

    registerBurst((x, y, n = 160) => {
      if (reduce) return
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const s = Math.random() * 8 + 1.2
        fx.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2.2, r: Math.random() * 2.2 + 0.5, life: 0, max: Math.random() * 80 + 70, hue: 36 + Math.random() * 16 })
      }
    })

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!amb.length && !fx.length) return
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      for (const p of amb) {
        p.y += p.vy
        p.ph += p.sp
        p.x += Math.sin(p.ph) * 0.18
        if (p.y < -10) Object.assign(p, mk(false))
        const tw = 0.45 + 0.55 * Math.sin(p.ph * 3)
        ctx.fillStyle = `hsla(43,85%,74%,${(p.a * tw * 0.5).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 6.283)
        ctx.fill()
      }
      for (let i = fx.length - 1; i >= 0; i--) {
        const p = fx[i]
        p.vx *= 0.972
        p.vy = p.vy * 0.972 + 0.075
        p.x += p.vx
        p.y += p.vy
        p.life++
        const k = 1 - p.life / p.max
        if (k <= 0) {
          fx.splice(i, 1)
          continue
        }
        ctx.fillStyle = `hsla(${p.hue},90%,${(62 + 22 * k).toFixed(0)}%,${k.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (0.5 + k * 0.7), 0, 6.283)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', size)
    }
  }, [reduce, registerBurst])

  return <canvas ref={ref} className="dust" aria-hidden="true" />
}
