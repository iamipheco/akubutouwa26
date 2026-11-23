import { AnimatePresence, motion } from 'motion/react'
import { useExperience } from '../lib/experience'
import { EASE } from '../lib/motion'

export function Toast() {
  const { toastMsg } = useExperience()
  return (
    <div role="status" aria-live="polite">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key={toastMsg.id}
            className="toast"
            initial={{ opacity: 0, x: '-50%', y: 16 }}
            animate={{ opacity: 1, x: '-50%', y: 0, transition: { opacity: { duration: 0.4 }, y: { duration: 0.6, ease: EASE } } }}
            exit={{ opacity: 0, x: '-50%', y: 16, transition: { duration: 0.35 } }}
          >
            {toastMsg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
