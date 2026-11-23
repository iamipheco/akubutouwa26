export type RsvpReply = {
  /** Stable per-guest id: lets "Change my reply" update the same row instead of adding a new one */
  id: string
  name: string
  phone: string
  attending: 'yes' | 'no'
  guests: number
  message: string
  submittedAt: string
}

const ENDPOINT = (import.meta.env.VITE_RSVP_ENDPOINT ?? '').trim()

/** True when replies only stay in the guest's browser (no endpoint configured) */
export const RSVP_PREVIEW = ENDPOINT === ''

const STORE_KEY = 'akubutouwa26:rsvp'
const ID_KEY = 'akubutouwa26:rsvp-id'

function newId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** This browser's reply id, created on first use and kept for later edits */
export function replyId(): string {
  try {
    const existing = localStorage.getItem(ID_KEY)
    if (existing) return existing
    const id = newId()
    localStorage.setItem(ID_KEY, id)
    return id
  } catch {
    // storage blocked: still unique for this visit
    return (replyId as unknown as { mem?: string }).mem ?? ((replyId as unknown as { mem?: string }).mem = newId())
  }
}

function keepLocal(reply: RsvpReply) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(reply))
  } catch {
    /* private mode or storage blocked: nothing to keep */
  }
}

/** The guest's last reply from this device, if any (used to prefill the form) */
export function lastReply(): RsvpReply | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as RsvpReply) : null
  } catch {
    return null
  }
}

/**
 * Sends a reply to VITE_RSVP_ENDPOINT as JSON.
 * The body is sent as text/plain so a Google Apps Script web app can receive it
 * without a CORS preflight (see docs/rsvp-google-sheet.gs). Replies carry the guest's
 * id, so a changed reply updates their existing row.
 */
export async function sendRsvp(reply: Omit<RsvpReply, 'id'>): Promise<RsvpReply> {
  const full: RsvpReply = { id: replyId(), ...reply }
  if (RSVP_PREVIEW) {
    await new Promise(r => setTimeout(r, 1100))
    keepLocal(full)
    return full
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(full),
  })
  if (!res.ok) throw new Error(`RSVP failed (${res.status})`)
  try {
    const body = (await res.json()) as { ok?: boolean }
    if (body && body.ok === false) throw new Error('RSVP rejected')
  } catch (e) {
    if (e instanceof Error && e.message === 'RSVP rejected') throw e
    /* non-JSON response: treat a 2xx as success */
  }
  keepLocal(full)
  return full
}
