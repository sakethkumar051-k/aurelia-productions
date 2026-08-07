import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google';
import type { ReactNode } from 'react';

import { RouteFade } from '@/components/route-fade';
import { ScrollFX } from '@/components/scroll-fx';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE } from '@/content/site';
import { siteUrl } from '@/lib/site-url';

import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const script = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-script',
});

const ui = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-ui',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — Events, Decor & Production across India`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'event management Pune',
    'wedding planner Pune',
    'wedding decor Mumbai',
    'Ganesh decoration',
    'festive decor',
    'wedding photography India',
    'corporate event production',
    'artist management India',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE.name,
    title: `${SITE.name} — Events, Decor & Production across India`,
    description: SITE.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Events, Decor & Production across India`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF0E4',
  colorScheme: 'light',
};

/**
 * Enables the scroll-reveal choreography before first paint. Kept inline so
 * content is never hidden if the bundle fails to load or motion is reduced.
 */
const BOOT_FX = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.fx='on'}}catch(e){}`;

const ORGANISATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EventPlanner'],
  name: SITE.name,
  description: SITE.description,
  slogan: SITE.motto,
  email: SITE.email,
  telephone: SITE.phone,
  foundingDate: SITE.founded,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'City', name: 'Pune' },
    { '@type': 'City', name: 'Mumbai' },
  ],
  openingHours: 'Mo-Sa 10:00-20:00',
  sameAs: [SITE.instagram],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const url = siteUrl();

  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${script.variable} ${ui.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_FX }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ ...ORGANISATION_SCHEMA, url }),
          }}
        />
      </head>
      <body>
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <div aria-hidden="true" className="grain" />
        <SiteHeader />
        <main id="main">
          <RouteFade>{children}</RouteFade>
        </main>
        <SiteFooter />
        <ScrollFX />
      </body>
    </html>
  );
}
