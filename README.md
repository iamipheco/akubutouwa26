# #Akubutouwa26

Digital invitation for the traditional marriage (Igba Nkwu) of **Chidimma Precious Ononye** and **Tochukwu Paul Nzekwesi**. The wedding is on Saturday 26 December 2026 at 12 noon, at Obosi Girls Field in Anambra.

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

- **Free option: a Google Sheet.** Follow the steps at the top of [`docs/rsvp-google-sheet.gs`](docs/rsvp-google-sheet.gs). Every reply becomes a row in the sheet.
- Copy `.env.example` to `.env.local` and paste the URL. Or set the same variable in your host's dashboard.
- If no URL is set, the site runs in **preview mode**. Replies stay only on the guest's device, and a small note under the button says so.

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
