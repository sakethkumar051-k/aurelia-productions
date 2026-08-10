import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google';
import type { ReactNode } from 'react';

import { getContent } from '@/lib/content';
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

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getContent();
  const title = `${brand.name} — Events, Decor & Production across India`;

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${brand.shortName}` },
    description: brand.description,
    applicationName: brand.name,
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
    authors: [{ name: brand.name }],
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: brand.name,
      title,
      description: brand.description,
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: brand.description,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: '/' },
  };
}

export const viewport: Viewport = {
  themeColor: '#FAF0E4',
  colorScheme: 'light',
};

/**
 * Enables the scroll-reveal choreography before first paint. Kept inline so
 * content is never hidden if the bundle fails to load or motion is reduced.
 */
const BOOT_FX = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.fx='on'}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${script.variable} ${ui.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_FX }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
