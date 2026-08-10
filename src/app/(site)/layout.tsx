import type { ReactNode } from 'react';

import { RouteFade } from '@/components/route-fade';
import { ScrollFX } from '@/components/scroll-fx';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getContent } from '@/lib/content';
import { siteUrl } from '@/lib/site-url';

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getContent();
  const { brand, contact } = content;

  const organisationSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EventPlanner'],
    name: brand.name,
    description: brand.description,
    slogan: brand.motto,
    email: contact.email,
    telephone: contact.phone,
    foundingDate: contact.founded,
    priceRange: '₹₹',
    url: siteUrl(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.street,
      addressLocality: contact.locality,
      addressRegion: contact.region,
      postalCode: contact.postalCode,
      addressCountry: contact.country,
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'City', name: contact.locality },
    ],
    openingHours: 'Mo-Sa 10:00-20:00',
    sameAs: [contact.instagram],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <div aria-hidden="true" className="grain" />
      <SiteHeader ctaLabel={content.header.cta} />
      <main id="main">
        <RouteFade>{children}</RouteFade>
      </main>
      <SiteFooter content={content} />
      <ScrollFX />
    </>
  );
}
