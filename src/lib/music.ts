import { useSyncExternalStore } from 'react'
import { audio } from './sound'
import { MUSIC } from '../data/event'

/**
 * Background music. It starts from the seal tap (browsers only allow sound after a tap),
 * fades in through a Web Audio gain node (so the fade also works on iPhone, where
 * <audio>.volume is ignored), pauses while the tab is hidden and resumes when it returns.
 */
type State = { available: boolean; playing: boolean }

let state: State = { available: true, playing: false }
const listeners = new Set<() => void>()
const set = (next: Partial<State>) => {
  state = { ...state, ...next }
  listeners.forEach(l => l())
}

let el: HTMLAudioElement | null = null
let gain: GainNode | null = null
let wanted = false // the guest's choice: should music be playing?

function element() {
  if (el) return el
  el = new Audio()
  el.src = MUSIC.src
  el.loop = true
  el.preload = 'none'
  el.addEventListener('error', () => set({ available: false, playing: false }))
  el.addEventListener('playing', () => set({ playing: true }))
  el.addEventListener('pause', () => set({ playing: false }))

  document.addEventListener('visibilitychange', () => {
    if (!el || !wanted) return
    if (document.hidden) el.pause()
    else void el.play().catch(() => {})
  })
  return el
}

function route(a: HTMLAudioElement) {
  if (gain) return gain
  const ac = audio()
  if (!ac) return null
  try {
    const src = ac.createMediaElementSource(a)
    gain = ac.createGain()
    gain.gain.value = 0
    src.connect(gain).connect(ac.destination)
  } catch {
    gain = null
  }
  return gain
}

function fade(to: number, seconds: number) {
  const ac = audio()
  if (!gain || !ac) {
    if (el) el.volume = to
    return
  }
  const t = ac.currentTime
  gain.gain.cancelScheduledValues(t)
  gain.gain.setValueAtTime(gain.gain.value, t)
  gain.gain.linearRampToValueAtTime(to, t + seconds)
}

export function markMusicMissing() {
  set({ available: false, playing: false })
}

/** Call from inside a tap/click handler */
export function startMusic(delay = 0.9) {
  if (!state.available) return
  const a = element()
  wanted = true
  route(a)
  if (a.currentTime === 0 && MUSIC.startAt) a.currentTime = MUSIC.startAt
  // play() must be called inside the tap; the gain stays silent, then swells in
  fade(0, 0)
  void a
    .play()
    .then(() => setTimeout(() => fade(MUSIC.volume, MUSIC.fadeIn), delay * 1000))
    .catch(() => set({ playing: false }))
}

export function pauseMusic(fadeOut = 0.6) {
  if (!el) return
  wanted = false
  fade(0, fadeOut)
  setTimeout(() => {
    if (!wanted) el?.pause()
  }, fadeOut * 1000 + 50)
}

export function toggleMusic() {
  if (wanted && state.playing) pauseMusic()
  else startMusic(0)
}

export function useMusic() {
  return useSyncExternalStore(
    cb => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
    () => state,
  )
}
