# #Akubutouwa26

Digital invitation for the traditional marriage (Igba Nkwu) of **Chidimma Precious Ononye** and **Tochukwu Paul Nzekwesi**. The wedding is on Saturday 26 December 2026 at 12 noon, at Obosi Girls Field in Anambra.

**Live:** [akubutouwa26.vercel.app](https://akubutouwa26.vercel.app) · Designed & built by [ICTech Solutions](https://ictech.ng)

Guests break a wax seal to open velvet doors, then scroll through the invitation in gold on wine:
- the families' formal invitation card
- a live countdown
- a gallery of the pre-wedding shoot
- an illustrated guide to the Igba Nkwu ceremony
- the date and venue, with calendar and map links
- an RSVP form that saves replies to a Google Sheet

"Beautiful" by Phyno plays softly in the background.

## Stack

| | |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4: design tokens in `@theme`, plus hand-written component CSS |
| Motion | Motion (`motion/react`, formerly Framer Motion) for reveals, the hero intro, scroll-linked effects, the lightbox and the RSVP flow |
| Smooth scroll | Lenis |

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

`dist/` is a static site. You can deploy it to Vercel, Netlify, Cloudflare Pages, GitHub Pages or any static host. No server is needed.

## Saving RSVPs

Replies are sent to the URL in the `VITE_RSVP_ENDPOINT` environment variable.

- **Free option: a Google Sheet.** Follow the steps at the top of [`docs/rsvp-google-sheet.gs`](docs/rsvp-google-sheet.gs). Each guest gets one row. If they change their reply, their row is updated and the "Updated" column shows when, instead of a new row being added. Phone numbers are stored as text, so the leading 0 stays.
- Copy `.env.example` to `.env.local` and paste the URL. Or set the same variable in your host's dashboard.
- If no URL is set, the site runs in **preview mode**. Replies stay only on the guest's device, and a small note under the button says so.

## Music

The site plays "Beautiful" by Phyno in the background.

- **When it starts:** browsers only allow sound after a tap, so the music starts when the guest taps the wax seal. It fades in over about 3 seconds.
- **Pausing:** a small gold button in the top-right corner pauses and resumes it. The music also pauses while the tab is in the background.

**The song file** is `public/music/beautiful.mp3`. To use a different song, replace that file (or point `src` in `src/data/event.ts` at a new one), then rebuild and redeploy. If the file is missing, there's no music and the button stays hidden.

**Adjust it.** In `src/data/event.ts`, the `MUSIC` settings control:
- `startAt`: how many seconds into the song to start, for example to skip the intro
- `volume`: from 0 to 1
- `fadeIn`: how many seconds the fade-in takes

Aim for a file under about 5 MB, since guests may be on mobile data. A 128 kbps MP3 of the full song is about 4 MB.

## Share image

When the link is posted on WhatsApp, Facebook or X, those apps show `public/og.jpg` (1200 × 630) as the preview picture.

- **Set the site's address.** Set `SITE_URL` to the site's real address (for example `https://akubutouwa26.com`) in `.env.local` or your host's dashboard. Social apps only show the image if they get its full address, which the site builds from `SITE_URL`.
- **To change the design,** edit `design/og.html` and render it again at 1200 × 630.
- **To refresh an old preview** that WhatsApp or Facebook has already saved, run the link through the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) ("Scrape again").

## Links you can share

| Link | What it does |
|---|---|
| `https://your-site/` | Opens on the cover. Guests tap the wax seal to open it. |
| `https://your-site/#rsvp` | Skips the cover and goes straight to the RSVP form. |
| `https://your-site/#details` | Skips the cover and goes straight to the date and venue. |

Any `#section` link skips the cover. Adding `?open` skips it too, landing at the top of the page.

## Where things live

```
src/
  data/event.ts           names, families, date, venue, photos, captions, tradition steps
  lib/experience.tsx      cover state, scroll lock, smooth anchors, gold-dust bursts, toasts
  lib/rsvp.ts             sends replies (or keeps them locally in preview mode)
  components/             one file per section, plus Gate, Dock, Cursor, GoldDust, Lightbox
  components/ui/          Reveal, SplitHeading, Ornament (Uli line art), MagneticLink, icons
  styles/                 tokens (index.css) and component CSS by area
public/images/            optimised .webp photos (Promzi Media)
design/                   the original single-file design prototype, kept for reference
```

To change any wording, edit `src/data/event.ts`.

## Accessibility and motion

- Every animation respects the device's "reduce motion" setting. With it on, the cover opens instantly, the photo crossfade stops, and smooth scrolling and parallax are turned off.
- The gold cursor appears only for mouse users.
- The countdown has a text version for screen readers.
