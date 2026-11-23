import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const Arrow = (p: P) => (
  <svg {...base} strokeWidth={1.6} aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const Calendar = (p: P) => (
  <svg {...base} strokeWidth={1.4} aria-hidden="true" {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const Clock = (p: P) => (
  <svg {...base} strokeWidth={1.4} aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const Pin = (p: P) => (
  <svg {...base} strokeWidth={1.4} aria-hidden="true" {...p}>
    <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
)
export const Hash = (p: P) => (
  <svg {...base} strokeWidth={1.4} aria-hidden="true" {...p}>
    <path d="M9.5 4 7.5 20M16.5 4l-2 16M4.5 9h15.5M3.5 15h15.5" />
  </svg>
)
export const Copy = (p: P) => (
  <svg {...base} strokeWidth={1.7} aria-hidden="true" {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
  </svg>
)
export const Close = (p: P) => (
  <svg {...base} strokeWidth={1.6} aria-hidden="true" {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const Prev = (p: P) => (
  <svg {...base} strokeWidth={1.6} aria-hidden="true" {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
)
export const Next = (p: P) => (
  <svg {...base} strokeWidth={1.6} aria-hidden="true" {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
)
export const Envelope = (p: P) => (
  <svg {...base} strokeWidth={1.5} aria-hidden="true" {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)
export const Image = (p: P) => (
  <svg {...base} strokeWidth={1.5} aria-hidden="true" {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="m21 16-5-5-9 9" />
  </svg>
)
export const Heart = (p: P) => (
  <svg {...base} strokeWidth={1.5} aria-hidden="true" {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  </svg>
)
