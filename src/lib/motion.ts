/** Shared easing curves, matching the CSS tokens --ease and --ease-io */
export type Bezier = [number, number, number, number]
export const EASE: Bezier = [0.16, 1, 0.3, 1]
export const EASE_IO: Bezier = [0.76, 0, 0.18, 1]
export const EASE_OUT_QUART = (t: number) => 1 - Math.pow(1 - t, 4)

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const pad2 = (n: number) => String(n).padStart(2, '0')
