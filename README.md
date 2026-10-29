# PERA HOTEL — website

Marketing site for PERA HOTEL, Chilonzor 8, Tashkent. Built to turn search and
map traffic into **phone calls to reception**.

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Dev server                          |
| `npm run build`     | Production build                    |
| `npm start`         | Serve the production build          |
| `npm run typecheck` | `tsc --noEmit`, strict              |
| `npm run lint`      | ESLint (`next/core-web-vitals` + TS)|

---

## Where to change things

**`config/hotel.ts` is the single source of truth.** Phone numbers, address,
map pin, media paths, rooms, facilities and social links all live there, and
every component reads from it. Never hard-code a phone number or an address in
a component.

Search that file for `TODO(owner)` to find everything still outstanding.

| I want to change…           | Edit                                               |
| --------------------------- | -------------------------------------------------- |
| Phone number                | `config/hotel.ts` → `contact.phones`                |
| Address / map pin           | `config/hotel.ts` → `location`                      |
| Hero image or video         | `config/hotel.ts` → `media.hero`                    |
| Gallery photos              | `config/hotel.ts` → `media.gallery`                 |
| Room categories and rates   | `config/hotel.ts` → `rooms`                         |
| Facilities                  | `config/hotel.ts` → `facilities`                    |
| Interface wording (uz/ru/en)| `lib/i18n/dictionaries.ts`                          |
| Production domain           | `NEXT_PUBLIC_SITE_URL` env var                      |
| Colours, type, motion       | `app/globals.css` (`@theme` block)                  |

### Media folders

```
public/images/brand/      logo, social share image
public/images/exterior/   facade, street view
public/images/entrance/   the entrance itself
public/images/rooms/      room photography
public/images/interiors/  lobby, reception, corridors
public/images/facilities/ confirmed services
public/videos/hero/       cinematic background loop (needs a poster image)
public/videos/entrance/   arrival clip
public/videos/rooms/      room walkthroughs
```

Drop files in, then reference them from `config/hotel.ts` with the real pixel
`width`/`height` so the browser can reserve space and avoid layout shift.

---

## Ground rule: no invented facts

Nothing on this site states a star rating, a review score, a distance, an
award, a rate or a facility the owner has not confirmed. That is enforced
structurally, not by convention:

- Sections with no data (`rooms`, `facilities`) **hide themselves** rather
  than render placeholder cards, and navigation is derived from what is
  actually configured, so links never point at a hidden section.
- `lib/phone.ts` is the only place a `tel:` link is built. With no valid
  number configured, call buttons render **nothing** instead of a dead link.
- `lib/maps.ts` falls back to a Google Maps *search* for the hotel name while
  the exact pin is unknown — it never drops a guessed coordinate.
- Structured data omits `streetAddress`, `geo`, `starRating`,
  `aggregateRating` and `priceRange` until they are verified.
- `npm run dev` shows a **"needs owner input"** panel listing everything still
  missing. It never renders in production.

---

## Languages

Uzbek (Latin) is the default and is served at `/`. Russian is at `/ru`,
English at `/en`. Each locale is a separate static page with its own
`<html lang>`, canonical URL and `hreflang` set, which is why there are two
root layouts (`app/(default)` and `app/(intl)`).

Translations are written by hand in `lib/i18n/dictionaries.ts` — not machine
output. Add a key there and TypeScript will require it in all three languages.

---

## Booking requests

The `#booking` section collects dates, guest count, name, phone and an
optional note, validates them (in the browser *and* again on the server), and
turns them into one standard message.

Where that message goes depends on configuration:

| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | What the guest sees |
| --- | --- |
| **set** | One tap. The request is posted straight to the hotel's Telegram and the guest gets a "request sent" confirmation. |
| **not set** (current) | The composed request plus a one-tap "Send on Telegram" deep link, a call button, and copy-to-clipboard. Nothing is lost, and the site never claims a request was received when it was not. |

To switch on one-tap delivery:

1. In Telegram, message `@BotFather` → `/newbot` → copy the token.
2. Add that bot to the chat (or group) reception watches, and get the chat id
   — message `@userinfobot`, or read it from
   `https://api.telegram.org/bot<TOKEN>/getUpdates` after sending the bot a message.
3. Set both values as environment variables on the host, then redeploy.

No payment is ever taken on the site, and the copy says so — this books a
*request*, which reception confirms by phone.

## Deployment

Live at **https://pera-hotel-tashkent.vercel.app** (Vercel project
`pera-hotel-tashkent`). `NEXT_PUBLIC_SITE_URL` is set there to that origin;
change it when a custom domain is connected, then redeploy so canonical,
Open Graph and sitemap URLs follow.

## Configured so far

- Phone: +998 95 373 55 00
- Address: Chilonzor 8-mavze, 49-uy, Tashkent
- Instagram and Telegram links
- Logo and one entrance photograph

## Still needed from the owner

1. **A verified Google Maps pin or place URL.** Until then the directions
   button runs a Maps *search* for the hotel name and address rather than
   pointing at a fixed destination, and `geo` is omitted from structured data.
2. **Entrance / property video**, plus a **higher-resolution landscape hero
   photo** — the current entrance image is 640×640, which softens on desktop
   and in the wide gallery tile.
3. Room and interior photography.
4. Confirmed room categories, capacities, rates and amenities.
5. Confirmed facilities (Wi-Fi, parking, breakfast, reception hours…).
6. A public email address, if the hotel uses one.
7. A custom domain, if wanted.
