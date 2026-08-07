import { SERVICES } from './services';

export const SITE = {
  name: 'The Aurevia Productions',
  shortName: 'Aurevia Productions',
  tagline: 'Events | Decor | Moments That Last',
  motto: 'We customize, You celebrate.',
  description:
    'Design-led event management, decor and production house staging weddings, festivals and brand spectacles across India — drawn by hand, executed to the minute.',
  /** Placeholder contact details — confirm with the client before launch. */
  email: 'hello@aurevia.in',
  phone: '+91 90000 00000',
  phoneHref: '+919000000000',
  whatsapp: 'https://wa.me/919000000000',
  instagram: 'https://instagram.com',
  address: {
    street: 'Aurevia Studio, Baner Road',
    locality: 'Pune',
    region: 'Maharashtra',
    postalCode: '411045',
    country: 'IN',
  },
  hours: 'Mon–Sat, 10am–8pm · Site visits by appointment',
  cities: 'Pune · Mumbai · Pan India',
  founded: '2017',
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Festive Decor', href: '/festive-decor' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
] as const;

export const MARQUEE_WORDS = [
  'Wedding Planning',
  'Stage & Floral Decor',
  'Ganesh Decor',
  'Photography & Film',
  'Celebrity Management',
  'Lighting & Backdrops',
  'Corporate Events',
  'Catering',
  'Makeup & Makeovers',
  'Brand Promotions',
];

export const FEATURED = [
  {
    cat: 'Wedding',
    title: 'Meher & Arjun',
    place: 'Lakeside, Udaipur',
    alt: 'Lakeside mandap at golden hour with ivory drapes',
    slot: 'feat-1',
  },
  {
    cat: 'Festive Decor',
    title: 'Bappa in Lotus',
    place: 'Mumbai',
    alt: 'Ganesh idol on a lotus throne with halo lighting',
    slot: 'feat-2',
  },
  {
    cat: 'Brand',
    title: 'Vertex Summit',
    place: 'Bengaluru',
    alt: 'Conference stage with wide LED backdrop',
    slot: 'feat-3',
  },
];

export const STATS = [
  { n: 450, suffix: '+', label: 'Events staged' },
  { n: 12, suffix: '', label: 'Cities covered' },
  { n: 24, suffix: '', label: 'In-house crew' },
  { n: 9, suffix: ' yrs', label: 'On the ground' },
];

/** 24×24 line-icon paths, 1.2px stroke, currentColor — as drawn in the design. */
export const TRUST = [
  {
    title: 'Creative Designs',
    body: 'Drawn for your family, rendered in 3D before we build a single frame.',
    icon: 'M12 3l2.2 5.2L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.8-1.1L12 3z',
  },
  {
    title: 'On Time Setup',
    body: 'Load-in schedules and rehearsals so your muhurat is never waiting on us.',
    icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2',
  },
  {
    title: 'Affordable Packages',
    body: 'Normal, Premium and Bespoke tiers with line-item costing — no hidden extras.',
    icon: 'M3 7h18v10H3zM3 11h18M7 15h4',
  },
  {
    title: 'Pan India Service',
    body: 'Crews, vendors and permissions handled in twelve cities and counting.',
    icon: 'M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'They took a two-line brief and returned a mandap our relatives still send photos of. Nothing ran late, not once.',
    name: 'Rhea & Kabir Malhotra',
    meta: 'Wedding week · Udaipur',
  },
  {
    quote:
      'Our Ganesh setup was the talk of the lane. Premium package, and still inside what our mandal had budgeted.',
    name: 'Shree Samarth Mandal',
    meta: 'Festive decor · Pune',
  },
  {
    quote:
      'Two hundred delegates, four vendors, one stage reveal. The show caller ran it to the second.',
    name: 'Ananya Iyer',
    meta: 'Head of Brand, Vertex · Bengaluru',
  },
];

export const TRUST_STRIP = [
  'Creative Designs',
  'On Time Setup',
  'Affordable Packages',
  'Pan India Service',
];

export const TIMELINE = [
  {
    n: '01',
    t: 'Consult',
    d: 'We listen to the family, the guest list and the number. You leave with a clear scope.',
  },
  {
    n: '02',
    t: 'Design',
    d: 'Mood boards, colour story, 3D renders and a line-item cost sheet you approve.',
  },
  {
    n: '03',
    t: 'Setup',
    d: 'Workshop fabrication, load-in schedules, floral chain and a full technical rehearsal.',
  },
  {
    n: '04',
    t: 'Execute',
    d: 'Crew on comms, run sheet in hand, and a teardown that leaves the venue spotless.',
  },
];

export const TEAM = [
  {
    name: 'Aarohi Deshpande',
    role: 'Founder & Creative Director',
    slot: 'team-1',
    alt: 'Portrait of the founder in a workshop',
  },
  {
    name: 'Vikrant Rane',
    role: 'Head of Production',
    slot: 'team-2',
    alt: 'Portrait of the production head on site',
  },
  {
    name: 'Sana Qureshi',
    role: 'Decor & Floral Lead',
    slot: 'team-3',
    alt: 'Portrait of the floral lead with fresh flowers',
  },
  {
    name: 'Nikhil Bhosale',
    role: 'Films & Photography Lead',
    slot: 'team-4',
    alt: 'Portrait of the films lead holding a camera',
  },
];

export const EXTRAS = [
  {
    t: 'Catering & Food Services',
    d: 'Menu curation, tastings, live counters and dessert stations with vetted kitchens.',
  },
  {
    t: 'Makeup & Makeovers',
    d: 'Bridal makeup, drapery and family makeovers by artists we work with every week.',
  },
];

export const GANESH_DO = [
  {
    t: 'Bappa Decor',
    icon: 'M12 3c3.3 0 6 2.5 6 5.6 0 2.3-1.4 3.6-1.4 5.4H7.4C7.4 12.2 6 10.9 6 8.6C6 5.5 8.7 3 12 3zM7.5 17h9M8.5 20h7',
  },
  { t: 'Theme Setups', icon: 'M4 20V8l8-5 8 5v12M9 20v-6h6v6' },
  {
    t: 'Flower Decor',
    icon: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 8.5V4M12 15.5V20M8.5 12H4M15.5 12H20',
  },
  {
    t: 'Lighting & Backdrops',
    icon: 'M9 18h6M10 21h4M12 3a6 6 0 0 1 3 11.2V16H9v-1.8A6 6 0 0 1 12 3z',
  },
  { t: 'Custom Designs', icon: 'M4 20l4-1 9.5-9.5a2.1 2.1 0 0 0-3-3L5 16l-1 4z' },
];

export type GaneshTier = {
  tier: string;
  price: string;
  featured: boolean;
  slot: string;
  alt: string;
  points: string[];
};

export const GANESH_TIERS: GaneshTier[] = [
  {
    tier: 'Normal',
    price: 'Budget-friendly',
    featured: false,
    slot: 'ganesh-normal',
    alt: 'Simple Ganesh decor with fabric drapes and marigold',
    points: [
      'Fabric drape backdrop with a gold border',
      'Marigold and seasonal fresh flowers',
      'Warm string and spot lighting',
      'Wooden makhar with cushioned seat',
      'Setup on the morning of Chaturthi',
      'Teardown after visarjan',
    ],
  },
  {
    tier: 'Premium',
    price: 'Full theme build',
    featured: true,
    slot: 'ganesh-premium',
    alt: 'Premium Ganesh set with carved lotus throne and halo lighting',
    points: [
      'Carved themed set — lotus, temple or palace',
      'Imported plus fresh floral layering',
      'Halo, wash and dimmer-cued lighting',
      'Sculpted makhar with a raised platform',
      '3D render approval before build',
      'Daily touch-ups through all ten days',
      'Aarti stage and queue-line decor',
      'Photo corner for visiting families',
    ],
  },
];

export const EVENT_TYPES = [
  'Wedding / Engagement',
  'Reception or Traditional Function',
  'Birthday or Private Party',
  'Ganesh / Festival Decor',
  'Photography or Film Shoot',
  'Corporate or College Event',
  'Brand Promotion or Activation',
  'Something else',
];

export const BUDGETS = [
  'Under ₹1 lakh',
  '₹1–5 lakh',
  '₹5–15 lakh',
  '₹15–40 lakh',
  '₹40 lakh +',
  'Not sure yet',
];

export const FOOTER_SERVICES = SERVICES.map((s) => ({
  title: s.title,
  href: `/services/${s.slug}`,
}));
