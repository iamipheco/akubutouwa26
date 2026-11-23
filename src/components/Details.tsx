import { useRef, type ReactNode } from 'react'
import { Reveal } from './ui/Reveal'
import { SplitHeading } from './ui/SplitHeading'
import { Arrow, Calendar, Clock, Hash, Pin } from './ui/icons'
import { useCopy } from '../lib/experience'
import { CALENDAR_URL, HASHTAG, VENUE } from '../data/event'

/** A detail card with a soft gold spotlight that follows the pointer */
function Card({ i, icon, k, children }: { i: number; icon: ReactNode; k: string; children: ReactNode }) {
  return (
    <Reveal
      as="article"
      className="dt"
      delay={i * 0.09}
      onPointerMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
      }}
    >
      <div className="dt-in">
        <span className="dt-ic">{icon}</span>
        <span className="dt-k">{k}</span>
        {children}
      </div>
    </Reveal>
  )
}

export function Details() {
  const copy = useCopy()
  const tagRef = useRef<HTMLParagraphElement>(null)
  return (
    <section className="dt-sec" id="details">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal as="p" variant="fade" className="eyebrow">
            The day
          </Reveal>
          <SplitHeading text="When &" accent="where" />
        </div>
        <div className="dt-grid">
          <Card i={0} icon={<Calendar />} k="Date">
            <p className="dt-v">Saturday, 26 December 2026</p>
            <p className="dt-s">Boxing Day</p>
            <a className="dt-a" href={CALENDAR_URL} target="_blank" rel="noopener">
              Add to calendar <Arrow />
            </a>
          </Card>
          <Card i={1} icon={<Clock />} k="Time">
            <p className="dt-v">12 noon</p>
            <p className="dt-s">West Africa Time (WAT)</p>
            <a className="dt-a" href="#countdown">
              See the countdown <Arrow />
            </a>
          </Card>
          <Card i={2} icon={<Pin />} k="Venue">
            <p className="dt-v">{VENUE.name}</p>
            <p className="dt-s">{VENUE.area}</p>
            <a className="dt-a" href={VENUE.maps} target="_blank" rel="noopener">
              Open in Google Maps <Arrow />
            </a>
          </Card>
          <Card i={3} icon={<Hash />} k="Hashtag">
            <p className="dt-v" ref={tagRef}>
              {HASHTAG}
            </p>
            <p className="dt-s">Use it when you share photos from the day</p>
            <button className="dt-a" type="button" onClick={() => copy(HASHTAG, tagRef.current)}>
              Copy hashtag <Arrow />
            </button>
          </Card>
        </div>
      </div>
    </section>
  )
}
