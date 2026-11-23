import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useExperience } from '../lib/experience'
import { markMusicMissing, toggleMusic, useMusic } from '../lib/music'
import { EASE } from '../lib/motion'
import { MUSIC } from '../data/event'

/** Small gold button (top right) to pause or resume the music; bars dance while it plays */
export function MusicToggle() {
  const { phase } = useExperience()
  const { available, playing } = useMusic()
  const [checked, setChecked] = useState(false)

  // make sure the song file is really there before offering a button for it
  useEffect(() => {
    let off = false
    fetch(MUSIC.src, { method: 'HEAD' })
      .then(r => {
        const type = r.headers.get('content-type') ?? ''
        if (!r.ok || !/audio|mpeg|octet-stream/.test(type)) markMusicMissing()
      })
      .catch(() => markMusicMissing())
      .finally(() => !off && setChecked(true))
    return () => {
      off = true
    }
  }, [])

  const show = checked && available && (phase === 'gone' || phase === 'hidden')

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className={`music${playing ? ' on' : ''}`}
          onClick={toggleMusic}
          aria-pressed={playing}
          aria-label={playing ? `Pause music: ${MUSIC.title} by ${MUSIC.artist}` : `Play music: ${MUSIC.title} by ${MUSIC.artist}`}
          title={`${MUSIC.title} · ${MUSIC.artist}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE, delay: 1.2 } }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.3 } }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="music-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
