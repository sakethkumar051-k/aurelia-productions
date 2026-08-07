# The Aurevia Productions — website

Marketing site for The Aurevia Productions, an Indian event-management, decor and
production house (Pune / Mumbai / pan-India). Built from the `design_handoff_aurevia_site`
prototype at high fidelity.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16, App Router, TypeScript** | Seven real routes including `/services/[slug]`, static prerendering for every page, and route handlers ready for the enquiry backend and the admin/photo layer that comes next. |
| Styling | **CSS Modules + a token layer** (`src/app/globals.css`) | The handoff specifies exact hex, px and easing values. Tokens plus scoped modules reproduce them verbatim and keep each section readable, without arbitrary-value soup. |
| Fonts | **`next/font/google`** — Cormorant Garamond, Great Vibes, Jost | Self-hosted and preloaded at build time, so no render-blocking request to Google and no layout shift. |
| Images | **`next/image`** behind a `Photo` slot component | Every photo position is addressed by a stable slot id; unfilled slots render an art-directed placeholder carrying the shot brief. |

```
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint
```

## Routes

| Route | View |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/services` | Services hub |
| `/services/[slug]` | Service detail — `weddings`, `decor`, `photography`, `entertainment`, `corporate` |
| `/festive-decor` | Ganeshotsav / festive decor |
| `/portfolio` | Portfolio grid + lightbox |
| `/contact` | Contact + enquiry form |
| `/api/enquiry` | Enquiry endpoint (see *Backend seams*) |

## Structure

```
src/
  app/                  routes, per-page CSS modules, sitemap, robots, icon
    api/enquiry/        enquiry route handler
  components/           header, footer, photo, scroll choreography, gallery, form, FAQ
  content/              all copy and data — services, portfolio, site, images
  lib/                  site URL helper
public/images/          photography
```

All copy and content data lives in `src/content/`, lifted verbatim from the prototype's
logic class. Moving it to a CMS later means replacing those modules, not the views.

## Interaction notes

- **Scroll reveal** — elements carry `data-reveal="y|x|zoom"`; `ScrollFX` observes them with
  `rootMargin: 0px 0px -8%`, `threshold: .06`, staggering siblings inside `[data-stagger]` by
  `min(index, 7) × 95ms`. An inline boot script sets `data-fx` on `<html>` **before first paint**,
  so nothing is ever hidden when JS fails or motion is reduced.
- **Count-up** — stats animate 0 → target over 1500ms with `1 - (1-p)³` easing, once.
- **Header** — transparent over the hero, solid ivory past 70px scroll with the border and
  shadow fading in over `.45s`.
- **Reduced motion** — `prefers-reduced-motion: reduce` disables every animation, transition,
  reveal, parallax and count-up; content renders at rest.

## Deviations from the handoff (deliberate)

The prototype markup is the source of truth where it and the README disagree — the README text
describes an earlier **dark maroon** treatment, while the prototype was revised to the **light
ivory ground** with maroon display type that this build reproduces.

Six small corrections, all to defects that would ship as bugs:

1. **Footer link hovers** — the prototype hovers Pages links to `#7A1F1F`, which is invisible on
   the `#4A1010` footer. Both link columns hover to `#E3C77B`.
2. **Footer "Services" column label** — was `#8A6820` while its siblings were `#E3C77B`; unified
   to `#E3C77B` for legibility on the dark ground.
3. **"Explore X →" hover** — hovered to `#E3C77B`, near-invisible on the `#FDF7EF` card. Now
   `#8A6820` text with a `#C9A44C` rule — same gold family, readable.
4. **Thank-you panel heading** — "Thank you" was `#E3C77B` on an ivory card. Now `#7A1F1F`,
   matching every other script line on a light ground.
5. **Lightbox prev/next** — positioned `top: 50%` with no offset, so they hung below centre.
   Now `translateY(-50%)`.
6. **Event type / budget selects** — both defaulted to their first real option, so `required` on
   the event type was meaningless and a budget was submitted the visitor never chose. Both now
   open on a placeholder.

## Enhancements added

- **Mobile navigation drawer** (open item #1 in the handoff) — gold-outline burger past 1080px,
  right-hand ivory panel in the house type, scrim, Escape to close, body scroll lock, focus
  returned to the toggle, `inert` when closed.
- **Enquiry form has real states** — `idle / submitting / error / sent`, inline per-field
  validation with `aria-invalid` and `aria-describedby`, focus moved to the first invalid field,
  a honeypot, and server-side revalidation.
- **Lightbox accessibility** — focus trap, focus restored to the tile that opened it, body scroll
  lock, live region on the counter, arrow/Escape keys, stepping scoped to the filtered set.
- **SEO** — per-route metadata, canonicals, Open Graph and Twitter cards, `sitemap.xml`,
  `robots.txt`, `LocalBusiness`/`EventPlanner` JSON-LD site-wide plus `Service` and `FAQPage`
  schema on each service page.
- **Accessibility** — skip link, `:focus-visible` rings, real landmarks and heading order,
  labelled controls, `aria-current` on navigation.
- **Route fade** — 260ms cross-fade on navigation, matching the prototype's transition.
- **Brand favicon**, mailto/tel links, `noopener` on outbound links, and a small-screen gutter.

## Backend seams (for the admin + photo work next)

Nothing here presumes a particular backend — three files are the seams:

1. **`src/content/images.ts`** — the slot → asset register. Swap the static imports for records
   from the media library, keeping the slot keys, and every photo position across the site fills
   in at once. Slot ids are documented in that file.
2. **`src/app/api/enquiry/route.ts`** — validates, throttles and currently logs the enquiry. The
   `TODO(backend)` marks where delivery goes: transactional email, a row in the admin database,
   a WhatsApp/CRM notification. The in-memory rate limiter needs a shared store once deployed to
   more than one instance.
3. **`src/content/*.ts`** — services, portfolio and site data. These become CMS reads when the
   admin can edit them.

## Still open

- **Photography** — 35 slots, one filled (`about-story`, carried over from the handoff). Each
  placeholder shows its art-direction brief.
- **Contact details are placeholders** — `hello@aurevia.in`, `+91 90000 00000`,
  `wa.me/919000000000`, and the Instagram URL. Confirm with the client.
- **Map** — still the designed CSS placeholder; needs a real embed for Baner, Pune.
- **`NEXT_PUBLIC_SITE_URL`** — set per environment so canonicals, Open Graph and the sitemap
  point at the real domain (falls back to `https://aurevia.in`).
