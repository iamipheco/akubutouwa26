/**
 * The sound of the seal breaking, synthesised with the Web Audio API (no audio files):
 * a double wax crack, a soft thud, the velvet doors' whoosh and a gold chime that rings out.
 * Browsers only allow audio after a tap/click, which is exactly when this plays.
 */
let ctx: AudioContext | null = null

/** One shared AudioContext for the seal sound and the background music */
export function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function noiseBuffer(ac: AudioContext, seconds: number) {
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

/** Short, bright crack of breaking wax */
function crack(ac: AudioContext, out: AudioNode, at: number, level: number, freq: number) {
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer(ac, 0.25)
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = freq
  bp.Q.value = 0.9
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(level, at + 0.003)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16)
  src.connect(bp).connect(g).connect(out)
  src.start(at)
  src.stop(at + 0.25)
}

/** Low thud as the seal gives way */
function thud(ac: AudioContext, out: AudioNode, at: number) {
  const o = ac.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(110, at)
  o.frequency.exponentialRampToValueAtTime(48, at + 0.22)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(0.55, at + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.3)
  o.connect(g).connect(out)
  o.start(at)
  o.stop(at + 0.32)
}

/** Soft whoosh of the velvet doors swinging open */
function whoosh(ac: AudioContext, out: AudioNode, at: number, dur: number) {
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer(ac, dur)
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 0.7
  lp.frequency.setValueAtTime(260, at)
  lp.frequency.exponentialRampToValueAtTime(1400, at + dur * 0.55)
  lp.frequency.exponentialRampToValueAtTime(380, at + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(0.14, at + dur * 0.45)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  src.connect(lp).connect(g).connect(out)
  src.start(at)
  src.stop(at + dur)
}

/** A bell-like note: a sine with a quiet inharmonic overtone, long gentle decay */
function bell(ac: AudioContext, out: AudioNode, at: number, freq: number, level: number) {
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(level, at + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 2.6)
  g.connect(out)
  for (const [mult, amp] of [
    [1, 1],
    [2.76, 0.18],
    [5.4, 0.06],
  ] as const) {
    const o = ac.createOscillator()
    o.type = 'sine'
    o.frequency.value = freq * mult
    const og = ac.createGain()
    og.gain.value = amp
    o.connect(og).connect(g)
    o.start(at)
    o.stop(at + 2.7)
  }
}

export function playSealSound() {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime + 0.02

  const master = ac.createGain()
  master.gain.value = 0.7
  master.connect(ac.destination)

  // a little room: feedback echo, darkened, so the chime blooms instead of stopping dead
  const delay = ac.createDelay(1)
  delay.delayTime.value = 0.23
  const fb = ac.createGain()
  fb.gain.value = 0.38
  const tone = ac.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 2600
  const wet = ac.createGain()
  wet.gain.value = 0.45
  delay.connect(tone).connect(fb).connect(delay)
  tone.connect(wet).connect(master)

  // the seal cracks in two
  crack(ac, master, t, 0.9, 2200)
  crack(ac, master, t + 0.055, 0.55, 1500)
  thud(ac, master, t)

  // the doors swing open (they start moving ~0.4s after the tap)
  whoosh(ac, master, t + 0.35, 1.7)

  // gold chime: a rising E-major arpeggio
  const chime = ac.createGain()
  chime.gain.value = 0.32
  chime.connect(master)
  chime.connect(delay)
  ;[1318.5, 1661.2, 1975.5, 2637].forEach((f, i) => bell(ac, chime, t + 0.16 + i * 0.09, f, i === 3 ? 0.5 : 0.7))

  // tidy up once everything has rung out
  setTimeout(() => master.disconnect(), 4500)
}
