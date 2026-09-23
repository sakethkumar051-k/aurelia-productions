# The Aurevia Productions — website

Marketing site for The Aurevia Productions, an Indian event-management, decor and
production house (Pune / Mumbai / pan-India). Built from the `design_handoff_aurevia_site`
prototype at high fidelity.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16, App Router, TypeScript** | Seven real routes including `/services/[slug]`, static prerendering for every page, and route handlers for the enquiry endpoint and admin session. |
| Content | **Firestore**, deep-merged onto bundled defaults | The client edits copy in `/admin`; the site still renders without Firebase, so a fresh clone, CI and previews all work with no credentials. |
| Caching | **Cache Components** (`use cache` + `updateTag`) | Marketing pages stay static HTML; an admin save expires the content tag so the change is live on the next request, with no stale window and no redeploy. |
| Admin auth | **Firebase Auth** → httpOnly session cookie | Browser credentials never leave the login screen; every admin page and action re-verifies the cookie server-side against an email allowlist. |
| Photography | **Cloudinary**, signed direct uploads | Image bytes never pass through this app, and `f_auto,q_auto` delivers AVIF/WebP per browser off Cloudinary's CDN. |
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
| `/api/enquiry` | Enquiry endpoint — archives to Firestore |
| `/admin` | Admin panel (Firebase Auth, `noindex`) |

## Structure

```
src/
  app/
    (site)/             the public site — one folder per route, with its CSS module
    admin/              the admin panel (its own chrome, no site header/footer)
    api/                enquiry endpoint, admin session exchange
    layout.tsx          html/body/fonts only
  components/
    admin/              nav, generic content editor, media manager, login
    …                   header, footer, photo, scroll choreography, gallery, form, FAQ
  content/
    schema.ts           the editable content tree (zod) — the single source of shape
    defaults.ts         the shipped copy, used as fallback and as "reset"
    sections.ts         admin navigation metadata
  lib/
    content.ts          Firestore read + deep merge + `use cache`
    auth.ts             session verification and the admin allowlist
    firebase/           Admin SDK (server) and client SDK (login only)
    cloudinary*.ts      URL loader and upload signing
  proxy.ts              optimistic admin guard (Next 16 renamed middleware → proxy)
public/images/          photography committed to the repo
```

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

## The admin panel

For the live handover and exact production setup steps, see [HANDOVER.md](./HANDOVER.md).

`/admin`, signed in with Firebase Auth. It edits hundreds of fields across the
public pages and site-wide sections — headings, navigation labels, logo wording,
button labels, list items, package bullets and FAQs.

**How content flows.** Firestore holds *partial overrides* of the tree in `content/<section>`
documents, deep-merged onto `src/content/defaults.ts` at read time. Consequences worth knowing:

- An empty database renders the original design. Firebase being down renders the original
  design. Neither is an outage.
- A save writes only the section that changed.
- Adding a field to `schema.ts` later cannot break content already saved — the default fills in.
- Every save is validated against the section's zod schema *before* it reaches Firestore, so the
  live site can never be handed a shape it cannot render.

**The editor is generic.** Inputs are chosen from the *shape* of the data — strings become text
inputs or textareas, arrays become reorderable lists with add/remove, objects become fieldsets.
Add a field to `schema.ts` and `defaults.ts` and it appears in the panel automatically; there is
no per-field form to maintain.

Two conventions an editor should know, both surfaced as hints in the panel:

- Section headings use `*asterisks*` for the italic gold emphasis — `Five pillars, one *atelier*`.
- Button labels use `{tier}` and `{name}` placeholders — `Enquire · {tier}`.

**Photographs.** `/admin/media` lists photo frames on the site, derived from the content
tree, each showing its art-direction brief. Uploads are signed server-side and go straight from
the browser to Cloudinary; only the public id and dimensions come back to Firestore. Frames with
no photograph render the placeholder carrying the brief.

**Enquiries.** Every submission is written to Firestore first — the inbox at `/admin/enquiries`
is the durable record — and email delivery is layered on top, so a mail provider outage can
never lose an enquiry.

## Setup

1. **Firebase.** Create a project. Enable **Firestore** and **Authentication → Email/Password**.
   Add a user for each person who will edit the site. Generate a service account key
   (Project settings → Service accounts).
2. **Cloudinary.** Create an account; copy the cloud name, API key and secret.
3. **Environment.** `cp .env.example .env.local` and fill it in. `ADMIN_EMAILS` decides who may
   sign in — leave it empty and nobody can, which is the safe default.
4. **Firestore rules.** Deploy `firestore.rules`. It denies all browser access, which is correct:
   the site reads Firestore server-side through the Admin SDK, never from a browser.

Firestore and Auth stay within the free Spark plan at this site's volume. Cloudinary's free tier
covers the photography. Nothing here needs a billing account.

## Still open

- **Photography** — 52 frames, one filled (`about-story`, carried over from the handoff). Upload
  the rest through `/admin/media`; each placeholder shows its art-direction brief.
- **Email delivery** — the enquiry endpoint archives to Firestore and marks a `TODO(email)` where
  the provider call goes. Pending the choice of Resend or SMTP.
- **Contact details are placeholders** — `hello@aurevia.in`, `+91 90000 00000`,
  `wa.me/919000000000`, and the Instagram URL. Confirm with the client.
- **Map** — still the designed CSS placeholder; needs a real embed for Baner, Pune.
- **Rate limiting** — the enquiry throttle is per-instance and resets on cold start. Fine for one
  server; needs a shared store if the site is ever deployed to several regions.
- **`NEXT_PUBLIC_SITE_URL`** — set per environment so canonicals, Open Graph and the sitemap
  point at the real domain (falls back to `https://aurelia-productions.vercel.app`).
