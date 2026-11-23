export type RsvpReply = {
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

function keepLocal(reply: RsvpReply) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(reply))
  } catch {
    /* private mode or storage blocked: nothing to keep */
  }
}

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
 * without a CORS preflight (see docs/rsvp-google-sheet.gs).
 */
export async function sendRsvp(reply: RsvpReply): Promise<void> {
  keepLocal(reply)
  if (RSVP_PREVIEW) {
    await new Promise(r => setTimeout(r, 1100))
    return
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(reply),
  })
  if (!res.ok) throw new Error(`RSVP failed (${res.status})`)
}
