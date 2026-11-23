import { useRef, useState, type FormEvent } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { Reveal, maskImg } from './ui/Reveal'
import { SplitHeading } from './ui/SplitHeading'
import { useExperience } from '../lib/experience'
import { useParallax } from '../hooks/useParallax'
import { EASE } from '../lib/motion'
import { RSVP_PREVIEW, lastReply, sendRsvp, type RsvpReply } from '../lib/rsvp'
import { COUPLE, PHOTOS } from '../data/event'

const E = EASE
const MAX_GUESTS = 6

const titleCase = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()

/** The thank-you card's wording for a reply */
function thanks(r: Pick<RsvpReply, 'name' | 'attending' | 'guests'>) {
  const first = titleCase(r.name.trim().split(/\s+/)[0])
  return {
    title: `Thank you, ${first}!`,
    text:
      r.attending === 'yes'
        ? r.guests > 1
          ? `We look forward to celebrating with you and ${r.guests - 1} guest${r.guests > 2 ? 's' : ''} on 26 December.`
          : 'We look forward to celebrating with you on 26 December.'
        : 'We will miss you, and we appreciate you letting us know.',
  }
}

export function Rsvp() {
  const reduce = useReducedMotion()
  const { burst } = useExperience()
  const photo = useParallax(-0.06)

  // a guest who already replied from this device sees their reply, ready to change
  const [prev] = useState(lastReply)
  const [name, setName] = useState(prev?.name ?? '')
  const [phone, setPhone] = useState(prev?.phone ?? '')
  const [att, setAtt] = useState<'yes' | 'no' | null>(prev?.attending ?? null)
  const [guests, setGuests] = useState(prev && prev.guests > 0 ? prev.guests : 1)
  const [msg, setMsg] = useState(prev?.message ?? '')
  const [errName, setErrName] = useState(false)
  const [errAtt, setErrAtt] = useState(false)
  const [errSend, setErrSend] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ title: string; text: string } | null>(() => (prev ? thanks(prev) : null))

  const card = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const yesRef = useRef<HTMLInputElement>(null)
  const stamp = useRef<HTMLDivElement>(null)
  const gVal = useRef<HTMLOutputElement>(null)

  const bump = () => {
    if (gVal.current && !reduce) animate(gVal.current, { y: [-6, 0], opacity: [0.3, 1] }, { duration: 0.38, ease: E })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    setErrName(!n)
    setErrAtt(!att)
    setErrSend(false)
    if (!n || !att) {
      if (card.current && !reduce) animate(card.current, { x: [0, -9, 8, -4, 0] }, { duration: 0.44, ease: 'easeOut' })
      ;(n ? yesRef.current : nameRef.current)?.focus()
      return
    }
    setBusy(true)
    let sent: RsvpReply
    try {
      sent = await sendRsvp({
        name: n,
        phone: phone.trim(),
        attending: att,
        guests: att === 'yes' ? guests : 0,
        message: msg.trim(),
        submittedAt: new Date().toISOString(),
      })
    } catch {
      setBusy(false)
      setErrSend(true)
      return
    }
    setBusy(false)
    setDone(thanks(sent))
    setTimeout(() => {
      const r = stamp.current?.getBoundingClientRect()
      if (r) burst(r.left + r.width / 2, r.top + r.height / 2, 120)
    }, 780)
  }

  const isDone = done !== null

  return (
    <section className="rs" id="rsvp">
      <div className="wrap rs-grid">
        <Reveal variant="mask" className="frame rs-photo">
          <div className="frame-box">
            <motion.div ref={photo.ref} className="frame-par" style={{ y: photo.y }}>
              <motion.img variants={maskImg()} src={PHOTOS.smile.src} width={PHOTOS.smile.w} height={PHOTOS.smile.h} alt="Chidimma smiling in her silver ichafu with Tochukwu behind her" loading="lazy" />
            </motion.div>
          </div>
        </Reveal>

        <div className="rs-main">
          <Reveal as="p" variant="fade" className="eyebrow solo">
            RSVP
          </Reveal>
          <SplitHeading text="Kindly" accent="reply" />
          <Reveal as="p" className="lede">
            Let us know if you can join us in Obosi on Saturday, 26 December.
          </Reveal>

          <Reveal delay={0.09} style={{ width: '100%' }}>
            <div className="rs-card" ref={card}>
              <motion.form
                className="rs-form"
                noValidate
                onSubmit={submit}
                initial={false}
                animate={isDone ? { opacity: 0, y: -24, visibility: 'hidden' } : { opacity: 1, y: 0, visibility: 'visible' }}
                transition={isDone ? { opacity: { duration: 0.5, ease: E }, y: { duration: 0.7, ease: E }, visibility: { delay: 0.7 } } : { duration: 0.6, ease: E }}
                aria-hidden={isDone}
              >
                <div className="field">
                  <label htmlFor="rsvp-name">Full name</label>
                  <input
                    ref={nameRef}
                    id="rsvp-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={e => {
                      setName(e.target.value)
                      setErrName(false)
                    }}
                    aria-invalid={errName}
                    aria-describedby={errName ? 'err-name' : undefined}
                  />
                  <i aria-hidden="true" />
                </div>
                {errName && (
                  <p className="err" id="err-name">
                    Add your name so the couple knows who is coming.
                  </p>
                )}

                <div className="field">
                  <label htmlFor="rsvp-phone">
                    Phone <span>(optional)</span>
                  </label>
                  <input id="rsvp-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="080 0000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
                  <i aria-hidden="true" />
                </div>

                <fieldset className="fs">
                  <legend>Will you attend?</legend>
                  <div className="seg" data-v={att ?? undefined}>
                    <span className="seg-ind" aria-hidden="true" />
                    <input
                      ref={yesRef}
                      type="radio"
                      id="att-yes"
                      name="att"
                      value="yes"
                      checked={att === 'yes'}
                      onChange={() => {
                        setAtt('yes')
                        setErrAtt(false)
                      }}
                    />
                    <label htmlFor="att-yes">Joyfully accept</label>
                    <input
                      type="radio"
                      id="att-no"
                      name="att"
                      value="no"
                      checked={att === 'no'}
                      onChange={() => {
                        setAtt('no')
                        setErrAtt(false)
                      }}
                    />
                    <label htmlFor="att-no">Regretfully decline</label>
                  </div>
                </fieldset>
                {errAtt && <p className="err">Choose whether you can attend.</p>}

                <div className={`guests${att === 'yes' ? '' : ' off'}`} aria-hidden={att !== 'yes'}>
                  <div>
                    <div className="guests-in">
                      <span className="lbl" id="g-lbl">
                        Guests, including you
                      </span>
                      <div className="stepper" role="group" aria-labelledby="g-lbl">
                        <button
                          type="button"
                          aria-label="Fewer guests"
                          disabled={guests <= 1}
                          tabIndex={att === 'yes' ? 0 : -1}
                          onClick={() => {
                            setGuests(g => Math.max(1, g - 1))
                            bump()
                          }}
                        >
                          −
                        </button>
                        <output ref={gVal} aria-live="polite">
                          {guests}
                        </output>
                        <button
                          type="button"
                          aria-label="More guests"
                          disabled={guests >= MAX_GUESTS}
                          tabIndex={att === 'yes' ? 0 : -1}
                          onClick={() => {
                            setGuests(g => Math.min(MAX_GUESTS, g + 1))
                            bump()
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="rsvp-msg">
                    A note for the couple <span>(optional)</span>
                  </label>
                  <textarea id="rsvp-msg" name="msg" rows={2} placeholder={`Your wishes for ${COUPLE.bride.first} and ${COUPLE.groom.first}`} value={msg} onChange={e => setMsg(e.target.value)} />
                  <i aria-hidden="true" />
                </div>

                <button className="btn btn-gold rs-submit" type="submit" disabled={busy} aria-busy={busy}>
                  {busy ? <span className="spin" aria-hidden="true" /> : <span>{prev || done !== null || lastReply() ? 'Update my RSVP' : 'Send RSVP'}</span>}
                  {busy && <span className="sr">Sending</span>}
                </button>
                {errSend && <p className="err" style={{ margin: 0, textAlign: 'center' }}>We could not send your reply. Please check your connection and try again.</p>}
                {RSVP_PREVIEW && <p className="rs-note">Preview mode: replies are kept on this device only.</p>}
              </motion.form>

              <motion.div
                className="rs-done"
                aria-live="polite"
                initial={false}
                animate={isDone ? { opacity: 1, y: 0, visibility: 'visible' } : { opacity: 0, y: 24, visibility: 'hidden' }}
                transition={isDone ? { opacity: { duration: 0.8, ease: E, delay: 0.25 }, y: { duration: 1, ease: E, delay: 0.25 } } : { opacity: { duration: 0.6, ease: E }, y: { duration: 0.8, ease: E }, visibility: { delay: 0.8 } }}
              >
                <div className={`stamp${isDone ? ' hit' : ''}`} ref={stamp} aria-hidden="true">
                  <span className="stamp-face">{COUPLE.monogram}</span>
                </div>
                <h3 className="gold">{done?.title ?? 'Thank you!'}</h3>
                <p>{done?.text}</p>
                <button className="btn btn-ghost" type="button" onClick={() => setDone(null)} tabIndex={isDone ? 0 : -1}>
                  Change my reply
                </button>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
