import { MotionConfig, useReducedMotion } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import { ExperienceProvider } from './lib/experience'
import { ScrollProgress } from './components/ScrollProgress'
import { GoldDust } from './components/GoldDust'
import { Cursor } from './components/Cursor'
import { Gate } from './components/Gate'
import { Hero } from './components/Hero'
import { Ribbon } from './components/Ribbon'
import { Invitation } from './components/Invitation'
import { Countdown } from './components/Countdown'
import { Moments } from './components/Moments'
import { Tradition } from './components/Tradition'
import { Details } from './components/Details'
import { Rsvp } from './components/Rsvp'
import { Footer } from './components/Footer'
import { Dock } from './components/Dock'
import { Toast } from './components/Toast'
import { OrnamentDefs } from './components/ui/Ornament'

function Page() {
  return (
    <ExperienceProvider>
      <ScrollProgress />
      <GoldDust />
      <OrnamentDefs />
      <Gate />
      <main>
        <Hero />
        <Ribbon />
        <Invitation />
        <Countdown />
        <Moments />
        <Tradition />
        <Details />
        <Rsvp />
        <Footer />
      </main>
      <Dock />
      <Toast />
      <Cursor />
    </ExperienceProvider>
  )
}

export default function App() {
  const reduce = useReducedMotion()
  return (
    <MotionConfig reducedMotion="user">
      {reduce ? (
        <Page />
      ) : (
        <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, autoRaf: true }}>
          <Page />
        </ReactLenis>
      )}
    </MotionConfig>
  )
}
