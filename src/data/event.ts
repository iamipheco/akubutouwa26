/* Everything the invitation says lives here, so wording can change without touching components. */

export const COUPLE = {
  bride: { first: 'Chidimma', full: 'Chidimma Precious Ononye' },
  groom: { first: 'Tochukwu', full: 'Tochukwu Paul Nzekwesi' },
  monogram: 'C&T',
}

export const FAMILIES = {
  bride: { parents: ['Late Mr Okechukwu Daniel Ononye', 'and Mrs Patience Ononye'], lga: 'Idemili North LGA' },
  groom: { parents: ['Late Chief Engr Francis Okwuchukwu', 'and Late Prophetess Rosepeace Nzekwesi'], lga: 'Idemili North LGA' },
  state: 'Anambra State',
}

export const HASHTAG = '#Akubutouwa26'

/**
 * Background music, starts when the seal is tapped.
 * The MP3 lives at public/music/beautiful.mp3 (change `src` to swap songs).
 * If the file is missing the music button simply hides itself.
 */
export const MUSIC = {
  src: '/music/beautiful.mp3',
  title: 'Beautiful',
  artist: 'Phyno',
  /** seconds into the song to begin, e.g. 12 to skip an intro */
  startAt: 0,
  /** 0–1 */
  volume: 0.55,
  /** seconds to fade in */
  fadeIn: 3,
}

/** 26 December 2026, 12:00 West Africa Time (UTC+1) */
export const EVENT_START = Date.UTC(2026, 11, 26, 11, 0, 0)

export const VENUE = {
  name: 'Obosi Girls Field',
  area: 'Obosi, Idemili North, Anambra State',
  short: 'Obosi Girls Field, Anambra',
  maps: 'https://www.google.com/maps/search/?api=1&query=Obosi%20Girls%20Field%2C%20Obosi%2C%20Anambra',
}

export const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=Chidimma%20%26%20Tochukwu%20%C2%B7%20Traditional%20Marriage' +
  '&dates=20261226T110000Z/20261226T170000Z' +
  '&location=Obosi%20Girls%20Field%2C%20Obosi%2C%20Anambra' +
  '&details=%23Akubutouwa26'

export type Photo = { src: string; w: number; h: number; alt: string }

const img = (name: string, w: number, h: number, alt = ''): Photo => ({ src: `/images/${name}.webp`, w, h, alt })

export const PHOTOS = {
  embrace: img('studio-embrace', 1041, 1511, 'Tochukwu in a red cap and coral beads holds Chidimma from behind; she smiles in beaded ivory lace and a silver ichafu'),
  full: img('studio-full', 849, 1248, 'Tochukwu in an ivory tunic, red cap and coral beads, with Chidimma in beaded ivory lace and a silver ichafu, her hand on his arm'),
  gaze: img('studio-gaze', 1024, 1280, 'Chidimma glances back at Tochukwu in a close portrait'),
  hands: img('studio-hands', 1024, 1280, "Tochukwu, head bowed, holds Chidimma's hand in the studio"),
  smile: img('studio-smile', 1024, 1280, 'Chidimma smiles at the camera as Tochukwu stands close behind her'),
  bench: img('akwete-bench', 1024, 1280, 'The couple seated on a bench, holding hands and laughing'),
  shy: img('akwete-shy', 1024, 1309, 'Chidimma smiling shyly as Tochukwu approaches'),
  hand: img('akwete-hand', 665, 996, "Tochukwu reaches for Chidimma's hand as she holds a horsetail whisk"),
  foliage: img('akwete-foliage', 1200, 1893, "Chidimma touches Tochukwu's beard, framed by leaves in golden light"),
}

/** Portraits that cross-fade in the hero frame */
export const HERO_SLIDES = [PHOTOS.embrace, PHOTOS.full, PHOTOS.gaze]

export type GalleryItem = Photo & { caption: string; ar: number }

export const GALLERY: GalleryItem[] = [
  { ...PHOTOS.bench, caption: 'Hands held on the garden bench', ar: 0.8 },
  { ...PHOTOS.shy, caption: 'The first look', ar: 0.782 },
  { ...PHOTOS.hand, caption: 'He offers his hand', ar: 0.668 },
  { ...PHOTOS.foliage, caption: 'Golden hour through the leaves', ar: 0.634 },
  { ...PHOTOS.hands, caption: 'Quiet before the day', ar: 0.8 },
  { ...PHOTOS.smile, caption: 'Her smile, his coral', ar: 0.8 },
  { ...PHOTOS.full, caption: 'Side by side', ar: 0.68 },
  { ...PHOTOS.gaze, caption: 'That look', ar: 0.8 },
]

export const TRADITION = [
  { n: 'I · Welcome', title: 'Ọjị, the kola nut', text: 'Elders bless and break the kola nut to welcome guests and open the gathering.', photo: PHOTOS.hands },
  { n: 'II · The cup', title: 'A cup of palm wine', text: 'Chidimma’s family fills a cup with palm wine and places it in her hands.', photo: PHOTOS.shy },
  {
    n: 'III · The search',
    title: 'She finds her husband',
    text: 'She walks through the crowd looking for Tochukwu while guests call out to distract her. When she finds him, she kneels and offers him the cup. He drinks, and everyone knows her choice.',
    photo: PHOTOS.hand,
  },
  { n: 'IV · Celebration', title: 'Dance, music and the feast', text: 'The couple dances to the cheers of family and friends, and the feasting begins.', photo: PHOTOS.bench },
]
