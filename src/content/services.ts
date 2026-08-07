export type Package = {
  tier: string;
  best: string;
  points: string[];
};

export type Faq = {
  q: string;
  a: string;
};

export type Service = {
  slug: string;
  short: string;
  eyebrow: string;
  title: string;
  script: string;
  blurb: string;
  items: string[];
  hero: string;
  includes: string[];
  packages: Package[];
  faqs: Faq[];
  gallery: string[];
};

export const SERVICES: Service[] = [
  {
    slug: 'weddings',
    short: 'Weddings',
    eyebrow: 'Pillar 01',
    title: 'Weddings & Celebrations',
    script: 'Forever, staged beautifully',
    blurb:
      'End-to-end planning for the whole wedding week — first mood board to the last vidaai petal.',
    items: [
      'Wedding Planning & Complete Event Management',
      'Engagements, Receptions & Traditional Functions',
      'Birthday & Private Events',
    ],
    hero: 'Mandap under a canopy of marigold and warm string lights, guests seated on ivory sofas',
    includes: [
      'A dedicated planner plus on-ground crew for every function',
      'Venue scouting, vendor shortlists, negotiation and contracts',
      'Colour story, mood boards and full decor design language',
      'Haldi, mehendi, sangeet, phera and reception scheduling',
      'Guest hospitality desk, room kits and transport rosters',
      'Catering tastings, menu curation and live counters',
      'Bridal makeup, saree drapery and family makeovers',
      'Minute-by-minute run sheet with a backup plan per slot',
    ],
    packages: [
      {
        tier: 'Normal',
        best: 'Single-day ceremony, 150–300 guests',
        points: [
          'One planner, day-of coordination',
          'Standard stage and entrance decor',
          'Vendor booking assistance',
          'Photo team for the main function',
        ],
      },
      {
        tier: 'Premium',
        best: 'Two to three functions, 300–700 guests',
        points: [
          'Planner plus 6-member crew',
          'Custom stage, entrance and mandap design',
          'Guest hospitality and transport desk',
          'Photo, film and same-day teaser edit',
        ],
      },
      {
        tier: 'Bespoke',
        best: 'Destination weeks, 700+ guests',
        points: [
          'Creative director on the project',
          'Ground-up set design and fabrication',
          'Artist and celebrity curation',
          'Documentary film crew and drone unit',
        ],
      },
    ],
    faqs: [
      {
        q: 'How early should we book you?',
        a: 'Six to nine months for a peak-season wedding, three months for an intimate one. We hold a date for seven days once the mood board is approved.',
      },
      {
        q: 'Do you travel outside your base cities?',
        a: 'Yes — we operate pan India. Travel, stay and local crew are quoted transparently as a separate line.',
      },
      {
        q: 'Can we keep our own photographer or caterer?',
        a: 'Absolutely. We coordinate any vendor you love and fold them into the master run sheet.',
      },
      {
        q: 'What does the payment schedule look like?',
        a: 'Twenty-five percent to block dates, fifty percent at design sign-off, the balance a week before the first function.',
      },
    ],
    gallery: [
      'Floral mandap in ivory and gold with hanging jasmine strands',
      'Sangeet stage with mirrored panels and warm uplighting',
      'Reception entrance arch framed by candles and orchids',
      'Bride entry aisle lined with brass lanterns',
    ],
  },
  {
    slug: 'decor',
    short: 'Decor',
    eyebrow: 'Pillar 02',
    title: 'Decor & Design',
    script: 'Every corner, considered',
    blurb:
      'Sets, stages, florals and light — designed in-house, fabricated by our own workshop.',
    items: [
      'Event & Wedding Decor',
      'Stage, Entrance & Floral Decor',
      'Ganesh / Festival Decor — Normal to Premium',
      'Custom Designs',
      'Lighting & Backdrops',
    ],
    hero: 'Wide stage set with carved gold arches, drapes in maroon and a floral backdrop',
    includes: [
      'Concept sketches and 3D render before a single flower is cut',
      'Stage, entrance, mandap and photo-corner design',
      'Fresh floral sourcing with a same-morning delivery chain',
      'Fabrication in our own workshop — no rented sameness',
      'Architectural and mood lighting design with dimmer cues',
      'Printed backdrops, signage, seating cards and menus',
      'Festival and Ganesh sets from Normal to Premium',
      'Setup, live touch-ups and full teardown',
    ],
    packages: [
      {
        tier: 'Normal',
        best: 'Home functions and single stages',
        points: [
          'One stage or entrance set',
          'Fresh and fabric floral mix',
          'Warm string and par lighting',
          'Setup and teardown crew',
        ],
      },
      {
        tier: 'Premium',
        best: 'Banquet and lawn weddings',
        points: [
          'Stage, entrance and two photo corners',
          'Imported and seasonal florals',
          'Layered lighting with dimmer cues',
          '3D render approval round',
        ],
      },
      {
        tier: 'Bespoke',
        best: 'Themed and destination builds',
        points: [
          'Original theme, carved and fabricated',
          'Custom props and sculptural elements',
          'Truss, moving heads and effects',
          'On-site designer through every function',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you reuse the same decor for other clients?',
        a: 'Structures are reused; the design is not. Themes, florals and finishes are drawn fresh for each family.',
      },
      {
        q: 'Can you work with a venue we have already booked?',
        a: 'Yes. We do a site recce, measure the space and design to its ceiling, power and access limits.',
      },
      {
        q: 'How late can we change the colour story?',
        a: 'Up to fourteen days before the function without a re-quote; after that floral orders are locked.',
      },
    ],
    gallery: [
      'Carved gold arch stage with maroon drapes',
      'Entrance corridor of hanging brass bells and marigold',
      'Ganesh set with lotus backdrop and warm halo lighting',
      'Floral ceiling installation over a dining lawn',
    ],
  },
  {
    slug: 'photography',
    short: 'Photo & Film',
    eyebrow: 'Pillar 03',
    title: 'Photography & Film',
    script: 'Frames you will frame',
    blurb:
      'Editorial coverage for families and brands — candid, cinematic, and delivered on time.',
    items: [
      'Wedding & Pre-Wedding Photography & Videography',
      'Ad Films & Promotional Shoots',
      'Fashion & Product Shoots',
    ],
    hero: 'Cinematographer on a gimbal following a couple through a lantern-lit corridor',
    includes: [
      'Pre-shoot creative call, shot list and location scouting',
      'Candid plus traditional photography teams',
      'Cinematic film with a licensed music score',
      'Pre-wedding and post-wedding shoot direction',
      'Ad films, brand promos and founder interviews',
      'Fashion lookbooks and product tabletop sets',
      'Colour-graded gallery within twenty-one days',
      'Album design, print and archival backup',
    ],
    packages: [
      {
        tier: 'Normal',
        best: 'One function, one day',
        points: [
          'One photographer, one cinematographer',
          'Three hundred edited images',
          'Three-minute highlight film',
          'Online gallery for one year',
        ],
      },
      {
        tier: 'Premium',
        best: 'Full wedding week',
        points: [
          'Two photo plus two film units',
          'Eight hundred edited images',
          'Teaser, highlight and full film',
          'Thirty-sheet designed album',
        ],
      },
      {
        tier: 'Bespoke',
        best: 'Brand films and destination stories',
        points: [
          'Director-led creative treatment',
          'Drone, gimbal and cine-prime kit',
          'Documentary-length edit',
          'Raw footage archive handover',
        ],
      },
    ],
    faqs: [
      {
        q: 'When do we get our photos?',
        a: 'A teaser gallery in seventy-two hours, the full colour-graded set within twenty-one days.',
      },
      {
        q: 'Do you shoot pre-wedding outside the city?',
        a: 'Yes. We plan two-day outstation shoots with permits, styling and travel handled by us.',
      },
      {
        q: 'Who owns the footage?',
        a: 'You do. We keep an archival backup for a year and ask only for portfolio usage rights.',
      },
    ],
    gallery: [
      'Couple portrait in a doorway with backlit haze',
      'Detail shot of bridal jewellery on silk',
      'Behind the scenes of an ad film set with lighting rig',
      'Product still life of sweets on a brass thali',
    ],
  },
  {
    slug: 'entertainment',
    short: 'Entertainment',
    eyebrow: 'Pillar 04',
    title: 'Entertainment & Talent',
    script: 'The night people talk about',
    blurb:
      'Artists, DJs, hosts and live acts — booked, briefed and cue-sheeted to your run of show.',
    items: [
      'Celebrity & Artist Management',
      'Live Music & Entertainment',
      'DJ & Musical Events',
    ],
    hero: 'Live band on a warm-lit stage with a dancing crowd in the foreground',
    includes: [
      'Artist shortlisting with real availability and budget bands',
      'Contracts, riders, hospitality and travel logistics',
      'Live bands, qawwali, dhol, folk and fusion acts',
      'DJ, sound, LED and effects packages',
      'Anchors and hosts briefed on family names and cues',
      'Choreography for sangeet and corporate acts',
      'Sound licensing and local permission support',
      'Show-flow direction with a stage manager on comms',
    ],
    packages: [
      {
        tier: 'Normal',
        best: 'Sangeet and house parties',
        points: [
          'DJ with sound and lights',
          'Dhol or a two-piece act',
          'Basic stage and monitor setup',
          'Four-hour show window',
        ],
      },
      {
        tier: 'Premium',
        best: 'Receptions and college fests',
        points: [
          'Headline DJ plus live band',
          'Line-array sound and LED wall',
          'Anchor and choreographed opener',
          'Full stage management crew',
        ],
      },
      {
        tier: 'Bespoke',
        best: 'Celebrity nights and brand shows',
        points: [
          'Playback singer or film celebrity',
          'Rider, security and green-room build',
          'Show director and technical rehearsal',
          'Broadcast-grade audio capture',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can you get a specific artist?',
        a: 'Share the name and date. We revert with availability, an all-in cost and the rider within three working days.',
      },
      {
        q: 'Do you handle sound permissions?',
        a: 'We prepare the paperwork and coordinate with the venue and local authorities; approval sits with them.',
      },
      {
        q: 'What if an artist cancels?',
        a: 'Every contract carries a substitution clause and we keep a briefed standby of similar calibre.',
      },
    ],
    gallery: [
      'Dhol players at a baraat under sparklers',
      'DJ console with LED wall behind a full dance floor',
      'Qawwali ensemble on a low candle-lit stage',
      'Choreographed sangeet performance mid-formation',
    ],
  },
  {
    slug: 'corporate',
    short: 'Corporate',
    eyebrow: 'Pillar 05',
    title: 'Corporate & Brand',
    script: 'On brand, on schedule',
    blurb:
      'Conferences, launches, college festivals and activations — production-managed to the second.',
    items: [
      'Corporate Events',
      'College Events & Festivals',
      'Brand Promotions & Advertising',
      'Event Production & Management',
      'Complete Event Setup & Coordination',
    ],
    hero: 'Conference stage with a wide LED backdrop, lectern and seated delegates',
    includes: [
      'Brief-to-concept deck with budget scenarios',
      'Venue, stage, LED, sound and truss production',
      'Registration, badging and delegate flow design',
      'Brand identity applied across every touchpoint',
      'College festival production and artist coordination',
      'Mall and market activations with promoter teams',
      'Technical rehearsal and cue-to-cue with AV',
      'Post-event report with footfall and media capture',
    ],
    packages: [
      {
        tier: 'Normal',
        best: 'Town halls and offsites up to 200',
        points: [
          'Stage, backdrop and AV',
          'Registration desk and signage',
          'Event manager on site',
          'Photo coverage',
        ],
      },
      {
        tier: 'Premium',
        best: 'Launches and conferences up to 1000',
        points: [
          'Full production and LED design',
          'Delegate app and badging',
          'Show caller and technical rehearsal',
          'Photo, film and press kit',
        ],
      },
      {
        tier: 'Bespoke',
        best: 'Festivals and multi-city activations',
        points: [
          'Creative and production direction',
          'Custom-built sets and zones',
          'Artist, host and influencer curation',
          'Multi-city rollout with one crew standard',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can you work to a fixed procurement budget?',
        a: 'Yes. Share the ceiling and we design to it, with a line-item quote and no surprise additions.',
      },
      {
        q: 'Do you provide GST invoicing and vendor compliance?',
        a: 'Yes — GST invoices, insurance certificates and vendor compliance documents on request.',
      },
      {
        q: 'How many events can you run at once?',
        a: 'Up to four concurrent productions, each with its own crew and a named account lead.',
      },
    ],
    gallery: [
      'Conference stage with wide LED and lectern',
      'Product launch reveal under focused spotlight',
      'College festival main stage at dusk',
      'Mall activation booth with brand graphics',
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function otherServices(slug: string): Service[] {
  return SERVICES.filter((s) => s.slug !== slug);
}
