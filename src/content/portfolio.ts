export type PortfolioItem = {
  cat: string;
  title: string;
  place: string;
  alt: string;
  /** Tile height in the masonry grid, in px — staggered by design. */
  h: number;
};

export const PORTFOLIO_FILTERS = [
  'All',
  'Weddings',
  'Decor',
  'Festive',
  'Photography',
  'Entertainment',
  'Corporate',
] as const;

export type PortfolioFilter = (typeof PORTFOLIO_FILTERS)[number];

export const PORTFOLIO: PortfolioItem[] = [
  {
    cat: 'Weddings',
    title: 'Meher & Arjun',
    place: 'Udaipur',
    alt: 'Lakeside mandap at golden hour with ivory drapes',
    h: 380,
  },
  {
    cat: 'Decor',
    title: 'Marigold Passage',
    place: 'Pune',
    alt: 'Entrance corridor hung with marigold strands and brass bells',
    h: 300,
  },
  {
    cat: 'Festive',
    title: 'Bappa in Lotus',
    place: 'Mumbai',
    alt: 'Ganesh idol on a lotus throne with halo lighting',
    h: 420,
  },
  {
    cat: 'Photography',
    title: 'First Light',
    place: 'Goa',
    alt: 'Pre-wedding portrait on a beach path at sunrise',
    h: 320,
  },
  {
    cat: 'Entertainment',
    title: 'Sangeet Nights',
    place: 'Nagpur',
    alt: 'Sangeet dance floor with LED wall and confetti',
    h: 360,
  },
  {
    cat: 'Corporate',
    title: 'Vertex Summit',
    place: 'Bengaluru',
    alt: 'Conference stage with wide LED backdrop and delegates',
    h: 300,
  },
  {
    cat: 'Weddings',
    title: 'Ivory & Ivy',
    place: 'Nashik',
    alt: 'Vineyard wedding aisle framed with white florals',
    h: 340,
  },
  {
    cat: 'Decor',
    title: 'Carved Gold',
    place: 'Hyderabad',
    alt: 'Carved gold arch stage with maroon velvet drapes',
    h: 400,
  },
  {
    cat: 'Festive',
    title: 'Navratri Courtyard',
    place: 'Ahmedabad',
    alt: 'Garba courtyard with mirrored drapes and lanterns',
    h: 300,
  },
  {
    cat: 'Photography',
    title: 'Karigar',
    place: 'Jaipur',
    alt: 'Detail shot of bridal jewellery resting on silk',
    h: 330,
  },
  {
    cat: 'Entertainment',
    title: 'Baraat Beat',
    place: 'Delhi',
    alt: 'Dhol players leading a baraat under sparklers',
    h: 360,
  },
  {
    cat: 'Corporate',
    title: 'Campus Carnival',
    place: 'Kolhapur',
    alt: 'College festival main stage lit at dusk',
    h: 320,
  },
];

/** Slot id for an item's photograph — matches the design handoff naming. */
export function portfolioSlot(title: string): string {
  return 'pf-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
