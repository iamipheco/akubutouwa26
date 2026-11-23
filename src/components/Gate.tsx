import { useEffect, useRef } from 'react'
import { useExperience } from '../lib/experience'
import { COUPLE, HASHTAG, VENUE } from '../data/event'
import { playSealSound } from '../lib/sound'

/** The cover: velvet doors and a wax seal that cracks open to reveal the invitation */
export function Gate() {
  const { phase, resetting, openGate } = useExperience()
  const seal = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (phase !== 'closed') return
    const t = setTimeout(() => seal.current?.focus({ preventScroll: true }), 300)
    return () => clearTimeout(t)
  }, [phase])

  const cls = ['gate', phase !== 'closed' && 'opening', (phase === 'gone' || phase === 'hidden') && 'gone', resetting && 'reset']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} role="dialog" aria-modal="true" aria-label="Invitation cover" hidden={phase === 'hidden'}>
      <div className="door l">
        <i className="band t" />
        <i className="band b" />
        <div className="door-frame" />
      </div>
      <div className="door r">
        <i className="band t" />
        <i className="band b" />
        <div className="door-frame" />
      </div>
      <div className="gate-inner">
        <p className="g-eyebrow">Welcome · {HASHTAG}</p>
        <p className="g-intro">You are invited to the traditional marriage of</p>
        <h2 className="g-names">
          <span className="gold">{COUPLE.bride.first}</span>
          <span className="amp">&amp;</span>
          <span className="gold">{COUPLE.groom.first}</span>
        </h2>
        <p className="g-date">Saturday · 26 December 2026</p>
        <p className="g-venue">{VENUE.short}</p>
        <button
          ref={seal}
          className="seal"
          type="button"
          aria-label="Break the seal and open the invitation"
          onClick={e => {
            if (phase !== 'closed') return
            playSealSound()
            const r = e.currentTarget.getBoundingClientRect()
            openGate({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
          }}
        >
          <span className="seal-ring" aria-hidden="true" />
          <span className="seal-ring b" aria-hidden="true" />
          <span className="seal-half l" aria-hidden="true">
            <span className="seal-face">
              C<i>&amp;</i>T
            </span>
          </span>
          <span className="seal-half r" aria-hidden="true">
            <span className="seal-face">
              C<i>&amp;</i>T
            </span>
          </span>
        </button>
        <p className="g-hint">Tap the seal to open</p>
      </div>
    </div>
  )
}
