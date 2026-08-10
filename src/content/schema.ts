import { z } from 'zod';

/**
 * The editable content tree.
 *
 * Every string a client would reasonably want to change lives here, and the
 * admin panel's forms are generated from this shape. Titles use `*asterisks*`
 * to mark the italic gold emphasis the design uses in headings — see the
 * `Emphasis` component.
 *
 * Firestore stores *partial* overrides of this tree, deep-merged onto the
 * bundled defaults. That means: a save only writes what changed, an empty
 * database renders the original design, and adding a field here later cannot
 * break content already saved.
 */

const text = z.string();
const list = <T extends z.ZodTypeAny>(item: T) => z.array(item);

/* Shared pieces ---------------------------------------------------------- */

const ctaPair = z.object({
  primary: text,
  secondary: text,
});

const heroBlock = z.object({
  eyebrow: text,
  title: text,
  body: text,
});

/* Collections ------------------------------------------------------------ */

export const packageSchema = z.object({
  tier: text,
  best: text,
  points: list(text),
});

export const faqSchema = z.object({
  q: text,
  a: text,
});

export const serviceSchema = z.object({
  slug: text,
  short: text,
  eyebrow: text,
  title: text,
  script: text,
  blurb: text,
  items: list(text),
  hero: text,
  includes: list(text),
  packages: list(packageSchema),
  faqs: list(faqSchema),
  gallery: list(text),
});

export const portfolioItemSchema = z.object({
  cat: text,
  title: text,
  place: text,
  alt: text,
  h: z.number(),
});

export const featuredItemSchema = z.object({
  slot: text,
  cat: text,
  title: text,
  place: text,
  alt: text,
});

export const statSchema = z.object({
  n: z.number(),
  suffix: text,
  label: text,
});

export const trustItemSchema = z.object({
  title: text,
  body: text,
  icon: text,
});

export const testimonialSchema = z.object({
  quote: text,
  name: text,
  meta: text,
});

export const timelineStepSchema = z.object({
  n: text,
  t: text,
  d: text,
});

export const teamMemberSchema = z.object({
  slot: text,
  name: text,
  role: text,
  alt: text,
});

export const extraSchema = z.object({
  t: text,
  d: text,
});

export const ganeshDoSchema = z.object({
  t: text,
  icon: text,
});

export const ganeshTierSchema = z.object({
  tier: text,
  price: text,
  featured: z.boolean(),
  slot: text,
  alt: text,
  points: list(text),
});

/* Media ------------------------------------------------------------------ */

export const mediaAssetSchema = z.object({
  publicId: text,
  width: z.number(),
  height: z.number(),
  alt: text.optional(),
  updatedAt: text.optional(),
});

/* Pages ------------------------------------------------------------------ */

const homeSchema = z.object({
  hero: z.object({
    eyebrow: text,
    titleLine1: text,
    titleLine2: text,
    script: text,
    body: text,
    cta: ctaPair,
  }),
  marquee: list(text),
  pillars: z.object({ eyebrow: text, title: text, body: text }),
  featured: z.object({
    eyebrow: text,
    title: text,
    cta: text,
    items: list(featuredItemSchema),
  }),
  stats: list(statSchema),
  why: z.object({ title: text, script: text, items: list(trustItemSchema) }),
  testimonials: z.object({
    eyebrow: text,
    title: text,
    items: list(testimonialSchema),
  }),
  closing: z.object({
    script: text,
    title: text,
    body: text,
    cta: ctaPair,
  }),
});

const aboutSchema = z.object({
  hero: z.object({ eyebrow: text, title: text, script: text }),
  story: z.object({
    eyebrow: text,
    title: text,
    paragraphs: list(text),
    imageAlt: text,
  }),
  philosophy: z.object({ eyebrow: text, quote: text }),
  process: z.object({
    eyebrow: text,
    title: text,
    steps: list(timelineStepSchema),
  }),
  team: z.object({
    eyebrow: text,
    title: text,
    members: list(teamMemberSchema),
    cta: text,
  }),
});

const servicesPageSchema = z.object({
  hero: heroBlock,
  /** `{name}` is replaced with the pillar's short name. */
  rowCta: text,
  extras: z.object({ eyebrow: text, title: text, items: list(extraSchema) }),
});

const serviceDetailSchema = z.object({
  eyebrowSuffix: text,
  heroCta: ctaPair,
  includes: z.object({ eyebrow: text, title: text, note: text }),
  packages: z.object({
    eyebrow: text,
    title: text,
    note: text,
    ribbon: text,
    /** `{tier}` is replaced with the package tier. */
    cta: text,
  }),
  gallery: z.object({ eyebrow: text, title: text }),
  faq: z.object({ eyebrow: text, title: text }),
  closing: z.object({ script: text, body: text, cta: text }),
  othersLabel: text,
});

const festiveSchema = z.object({
  hero: z.object({
    eyebrow: text,
    title: text,
    script: text,
    body: text,
    cta: ctaPair,
  }),
  wedo: z.object({ title: text, body: text, items: list(ganeshDoSchema) }),
  compare: z.object({
    eyebrow: text,
    title: text,
    note: text,
    /** `{tier}` is replaced with the tier name. */
    cta: text,
    tiers: list(ganeshTierSchema),
  }),
  booking: z.object({
    script: text,
    title: text,
    body: text,
    cta: ctaPair,
  }),
});

const portfolioPageSchema = z.object({
  hero: heroBlock,
  items: list(portfolioItemSchema),
});

const contactPageSchema = z.object({
  hero: z.object({ eyebrow: text, title: text, script: text }),
  form: z.object({
    title: text,
    intro: text,
    labels: z.object({
      name: text,
      phone: text,
      type: text,
      date: text,
      city: text,
      budget: text,
      message: text,
    }),
    placeholders: z.object({
      name: text,
      phone: text,
      city: text,
      message: text,
      select: text,
      budget: text,
    }),
    submit: text,
    submitting: text,
    eventTypes: list(text),
    budgets: list(text),
  }),
  thanks: z.object({ script: text, title: text, body: text, cta: text }),
  reach: z.object({
    eyebrow: text,
    title: text,
    body: text,
    cta: ctaPair,
  }),
  studioLabel: text,
  mapCaption: text,
});

const footerSchema = z.object({
  trustStrip: list(text),
  script: text,
  blurb: text,
  pagesLabel: text,
  servicesLabel: text,
  enquiriesLabel: text,
  cta: text,
  legalLeft: text,
  legalRight: text,
});

/* Root ------------------------------------------------------------------- */

export const contentSchema = z.object({
  brand: z.object({
    name: text,
    shortName: text,
    tagline: text,
    motto: text,
    description: text,
  }),
  contact: z.object({
    email: text,
    phone: text,
    phoneHref: text,
    whatsapp: text,
    instagram: text,
    street: text,
    locality: text,
    region: text,
    postalCode: text,
    country: text,
    hours: text,
    cities: text,
    founded: text,
  }),
  header: z.object({ cta: text }),
  footer: footerSchema,
  home: homeSchema,
  about: aboutSchema,
  servicesPage: servicesPageSchema,
  serviceDetail: serviceDetailSchema,
  festive: festiveSchema,
  portfolio: portfolioPageSchema,
  contactPage: contactPageSchema,
  services: list(serviceSchema),
  media: z.record(text, mediaAssetSchema),
});

export type Content = z.infer<typeof contentSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Package = z.infer<typeof packageSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type GaneshTier = z.infer<typeof ganeshTierSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;

/** Top-level sections the admin panel edits and saves independently. */
export const CONTENT_SECTIONS = [
  'brand',
  'contact',
  'header',
  'footer',
  'home',
  'about',
  'servicesPage',
  'serviceDetail',
  'festive',
  'portfolio',
  'contactPage',
  'services',
  'media',
] as const;

export type ContentSection = (typeof CONTENT_SECTIONS)[number];
