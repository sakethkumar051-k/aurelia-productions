import type { ContentSection } from './schema';

export type SectionMeta = {
  key: ContentSection;
  label: string;
  description: string;
  group: 'Pages' | 'Collections' | 'Site-wide';
  /** Where this content shows up, for the "view it live" link. */
  preview?: string;
};

/**
 * Drives the admin panel's navigation and section pages. Order here is the
 * order an editor sees.
 */
export const SECTION_META: SectionMeta[] = [
  {
    key: 'home',
    label: 'Home page',
    description:
      'Hero, the ticker, section headings, featured work, statistics, testimonials and the closing call to action.',
    group: 'Pages',
    preview: '/',
  },
  {
    key: 'about',
    label: 'About page',
    description: 'Story, philosophy quote, the four-step process and the team.',
    group: 'Pages',
    preview: '/about',
  },
  {
    key: 'servicesPage',
    label: 'Services hub',
    description:
      'The hub page heading and the two "also arranged" add-on cards.',
    group: 'Pages',
    preview: '/services',
  },
  {
    key: 'serviceDetail',
    label: 'Service page labels',
    description:
      'Section headings shared by all five service pages — packages, gallery, questions and the closing card.',
    group: 'Pages',
    preview: '/services/weddings',
  },
  {
    key: 'festive',
    label: 'Festive Decor page',
    description:
      'Ganeshotsav hero, the "we do" cards, the Normal vs Premium tiers and the booking band.',
    group: 'Pages',
    preview: '/festive-decor',
  },
  {
    key: 'portfolio',
    label: 'Portfolio page',
    description:
      'The heading and every portfolio tile — title, place, category and tile height.',
    group: 'Pages',
    preview: '/portfolio',
  },
  {
    key: 'contactPage',
    label: 'Contact page',
    description:
      'Enquiry form labels, the event type and budget dropdowns, the thank-you panel and the WhatsApp card.',
    group: 'Pages',
    preview: '/contact',
  },
  {
    key: 'services',
    label: 'The five pillars',
    description:
      'Everything about each service: blurb, chips, the eight includes, three packages and the questions.',
    group: 'Collections',
    preview: '/services',
  },
  {
    key: 'brand',
    label: 'Brand',
    description: 'Name, tagline, motto and the description search engines read.',
    group: 'Site-wide',
  },
  {
    key: 'contact',
    label: 'Contact details',
    description:
      'Email, phone, WhatsApp, Instagram and the studio address — used across the site and in structured data.',
    group: 'Site-wide',
  },
  {
    key: 'header',
    label: 'Header',
    description: 'The booking button label in the navigation bar.',
    group: 'Site-wide',
  },
  {
    key: 'footer',
    label: 'Footer',
    description:
      'Trust strip, column labels, the tagline and the copyright line.',
    group: 'Site-wide',
  },
];

export function sectionMeta(key: string): SectionMeta | undefined {
  return SECTION_META.find((section) => section.key === key);
}
