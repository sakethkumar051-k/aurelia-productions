import type { Content } from './schema';
import { SERVICES } from './services';
import { PORTFOLIO } from './portfolio';
import {
  BUDGETS,
  EVENT_TYPES,
  EXTRAS,
  FEATURED,
  GANESH_DO,
  GANESH_TIERS,
  MARQUEE_WORDS,
  SITE,
  STATS,
  TEAM,
  TESTIMONIALS,
  TIMELINE,
  TRUST,
  TRUST_STRIP,
} from './site';

/**
 * The shipped content — exactly the copy in the approved design.
 *
 * This is the fallback the site renders when Firestore holds nothing for a
 * field, and the seed the admin panel offers as "reset to original".
 */
export const defaultContent: Content = {
  brand: {
    name: SITE.name,
    shortName: SITE.shortName,
    tagline: SITE.tagline,
    motto: SITE.motto,
    description: SITE.description,
  },

  contact: {
    email: SITE.email,
    phone: SITE.phone,
    phoneHref: SITE.phoneHref,
    whatsapp: SITE.whatsapp,
    instagram: SITE.instagram,
    street: SITE.address.street,
    locality: SITE.address.locality,
    region: SITE.address.region,
    postalCode: SITE.address.postalCode,
    country: SITE.address.country,
    hours: SITE.hours,
    cities: SITE.cities,
    founded: SITE.founded,
  },

  header: { cta: 'DM for Booking' },

  footer: {
    trustStrip: [...TRUST_STRIP],
    script: 'Moments that last',
    blurb:
      'Events, decor and production — pan India, from intimate ceremonies to city-scale festivals.',
    pagesLabel: 'Pages',
    servicesLabel: 'Services',
    enquiriesLabel: 'Enquiries',
    cta: 'DM for Booking',
    legalLeft: '© 2026 The Aurevia Productions. All rights reserved.',
    legalRight: 'Events | Decor | Moments That Last',
  },

  home: {
    hero: {
      eyebrow: 'Event Management · Decor · Production · India',
      titleLine1: 'The Aurevia',
      titleLine2: 'Productions',
      script: 'Events | Decor | Moments That Last',
      body: 'We customize, You celebrate. A design-led house staging weddings, festivals and brand spectacles across India — drawn by hand, executed to the minute.',
      cta: { primary: 'Book Your Dates Now', secondary: 'View Our Services' },
    },
    marquee: [...MARQUEE_WORDS],
    pillars: {
      eyebrow: 'What we do',
      title: 'Five pillars, one *atelier*',
      body: 'Every mandap, every frame, every cue sheet is made for one family or one brand — never repeated.',
    },
    featured: {
      eyebrow: 'Featured work',
      title: 'Recent *celebrations*',
      cta: 'Full Portfolio',
      items: FEATURED.map((item) => ({
        slot: item.slot,
        cat: item.cat,
        title: item.title,
        place: item.place,
        alt: item.alt,
      })),
    },
    stats: STATS.map((stat) => ({ ...stat })),
    why: {
      title: 'Why families and brands *choose us*',
      script: 'We customize, You celebrate.',
      items: TRUST.map((item) => ({ ...item })),
    },
    testimonials: {
      eyebrow: 'Kind words',
      title: 'Moments that *lasted*',
      items: TESTIMONIALS.map((item) => ({ ...item })),
    },
    closing: {
      script: 'Let’s begin',
      title: 'Your date is still *open*',
      body: 'Tell us the city, the date and the dream. We send back a mood board and a costed plan within 48 hours.',
      cta: { primary: 'Get a Custom Quote', secondary: 'Festive Decor 2026' },
    },
  },

  about: {
    hero: {
      eyebrow: 'About the house',
      title: 'A studio built on *detail*',
      script: 'We customize, You celebrate.',
    },
    story: {
      eyebrow: 'Our story',
      title: 'Nine years of *first dances*',
      paragraphs: [
        'Aurevia began with one mandap in a Pune housing society and a promise that nobody would have to chase us on the morning of the function. Nine years on we are a workshop, a floral chain, a films unit and a production crew — still run by the people who answer your first call.',
        'We design in-house and fabricate in-house. That is why a theme you approve on a render is the theme that arrives on the truck, and why a Normal package never feels like a lesser version of a Premium one.',
        'Weddings, festivals, films and brand stages — different crafts, one standard.',
      ],
      imageAlt: 'Workshop table with fabric swatches, flowers and sketches',
    },
    philosophy: {
      eyebrow: 'Philosophy',
      quote:
        'A celebration is not a set of vendors. It is one story told in flowers, light, sound and timing — and it should sound like your family, not like ours.',
    },
    process: {
      eyebrow: 'How we work',
      title: 'Consult · Design · Setup · *Execute*',
      steps: TIMELINE.map((step) => ({ ...step })),
    },
    team: {
      eyebrow: 'The people',
      title: 'Who you will *actually meet*',
      members: TEAM.map((member) => ({
        slot: member.slot,
        name: member.name,
        role: member.role,
        alt: member.alt,
      })),
      cta: 'Get a Custom Quote',
    },
  },

  servicesPage: {
    hero: {
      eyebrow: 'Services',
      title: 'Everything a celebration *needs*',
      body: 'Five pillars, each with its own team and its own detail pages. Mix them, or hand us the whole calendar.',
    },
    rowCta: 'Open {name} Page',
    extras: {
      eyebrow: 'Also arranged',
      title: 'Add these to any *package*',
      items: EXTRAS.map((extra) => ({ ...extra })),
    },
  },

  serviceDetail: {
    eyebrowSuffix: 'Services',
    heroCta: { primary: 'Get a Custom Quote', secondary: 'All Services' },
    includes: {
      eyebrow: 'What’s included',
      title: 'Handled *end to end*',
      note: 'Every line below is quoted openly. Remove what you don’t need — the plan flexes, the standard doesn’t.',
    },
    packages: {
      eyebrow: 'Packages',
      title: 'Normal · Premium · *Bespoke*',
      note: 'Tiers are a starting shape, not a cage. Final costing follows your guest count, city and dates.',
      ribbon: 'Most chosen',
      cta: 'Enquire · {tier}',
    },
    gallery: { eyebrow: 'Gallery', title: 'From recent *projects*' },
    faq: { eyebrow: 'Questions', title: 'Before you *enquire*' },
    closing: {
      script: 'Shall we begin?',
      body: 'Send us the date and city. A costed plan and a mood board come back within 48 hours.',
      cta: 'DM for Booking',
    },
    othersLabel: 'Other pillars',
  },

  festive: {
    hero: {
      eyebrow: 'Festive Decor · Ganeshotsav 2026',
      title: 'Celebrate Bappa with *Love & Beauty*',
      script: 'Normal to Premium · Homes, Mandals & Offices',
      body: 'Makhar, backdrop, florals and lighting — designed, built and installed by our own crew, then taken down after visarjan.',
      cta: { primary: 'Book Your Dates Now', secondary: 'See Festive Work' },
    },
    wedo: {
      title: 'We *do*',
      body: 'Pick the whole set or just the pieces your mandal still needs.',
      items: GANESH_DO.map((item) => ({ ...item })),
    },
    compare: {
      eyebrow: 'Packages',
      title: 'Normal vs *Premium*',
      note: 'Both tiers include installation, daily touch-ups on request and full teardown after visarjan. Custom themes are quoted on drawing.',
      cta: 'Book {tier}',
      tiers: GANESH_TIERS.map((tier) => ({
        tier: tier.tier,
        price: tier.price,
        featured: tier.featured,
        slot: tier.slot,
        alt: tier.alt,
        points: [...tier.points],
      })),
    },
    booking: {
      script: 'Ganpati Bappa Morya',
      title: 'Book Your Dates Now!',
      body: 'Festive slots fill six weeks ahead. Send your lane, your idol height and your budget — we revert with a drawing.',
      cta: { primary: 'DM for Booking', secondary: 'All Decor Services' },
    },
  },

  portfolio: {
    hero: {
      eyebrow: 'Portfolio',
      title: 'Moments that *lasted*',
      body: 'Filter by craft. Tap any frame to open it larger.',
    },
    items: PORTFOLIO.map((item) => ({ ...item })),
  },

  contactPage: {
    hero: {
      eyebrow: 'Contact',
      title: 'Tell us the *date*',
      script: 'We customize, You celebrate.',
    },
    form: {
      title: 'Enquiry form',
      intro: 'Six fields. We reply within 48 hours with a plan and a number.',
      labels: {
        name: 'Your name',
        phone: 'Phone / WhatsApp',
        type: 'Event type',
        date: 'Event date',
        city: 'City',
        budget: 'Budget range',
        message: 'Tell us about it',
      },
      placeholders: {
        name: 'Full name',
        phone: '+91',
        city: 'Pune, Mumbai, elsewhere',
        message: 'Functions, guest count, venue, the look you have in mind',
        select: 'Choose one',
        budget: 'Choose a range',
      },
      submit: 'Send Enquiry',
      submitting: 'Sending…',
      eventTypes: [...EVENT_TYPES],
      budgets: [...BUDGETS],
    },
    thanks: {
      script: 'Thank you',
      title: 'Your enquiry is with us',
      body: 'We reply within 48 hours with a mood board and a costed plan. For urgent dates, WhatsApp us directly.',
      cta: 'Send another',
    },
    reach: {
      eyebrow: 'Faster than email',
      title: 'WhatsApp & DM',
      body: 'Send the date, city and a reference photo. We revert with availability the same day.',
      cta: { primary: 'WhatsApp Us', secondary: 'DM on Instagram' },
    },
    studioLabel: 'Studio',
    mapCaption: 'Map placeholder · Baner, Pune',
  },

  services: SERVICES.map((service) => ({
    ...service,
    items: [...service.items],
    includes: [...service.includes],
    gallery: [...service.gallery],
    packages: service.packages.map((pkg) => ({ ...pkg, points: [...pkg.points] })),
    faqs: service.faqs.map((faq) => ({ ...faq })),
  })),

  media: {},
};
