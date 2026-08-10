import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Emphasis, fill } from '@/components/emphasis';
import { FaqAccordion } from '@/components/faq-accordion';
import { CheckMark } from '@/components/lotus-divider';
import { Photo } from '@/components/photo';
import { defaultContent } from '@/content/defaults';
import { getContent, getService, otherServices } from '@/lib/content';
import { siteUrl } from '@/lib/site-url';

import styles from './service.module.css';

type Params = { slug: string };

/**
 * Prerender the pillars that ship with the design. A pillar added later in the
 * admin panel still renders — it is served on demand and cached from then on.
 */
export function generateStaticParams(): Params[] {
  return defaultContent.services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const service = getService(content, slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.blurb,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} · ${content.brand.shortName}`,
      description: service.blurb,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const service = getService(content, slug);

  if (!service) notFound();

  const { serviceDetail, media, brand } = content;
  const siblings = otherServices(content, service.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        description: service.blurb,
        serviceType: service.items,
        url: `${siteUrl()}/services/${service.slug}`,
        provider: { '@type': 'LocalBusiness', name: brand.name },
        areaServed: { '@type': 'Country', name: 'India' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.title} packages`,
          itemListElement: service.packages.map((pkg) => ({
            '@type': 'Offer',
            name: pkg.tier,
            description: pkg.best,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section aria-labelledby="dt-h" className={styles.hero}>
        <div className={styles.heroPhoto}>
          <Photo
            slot={`svc-hero-${service.slug}`}
            asset={media[`svc-hero-${service.slug}`]}
            alt={service.hero}
            sizes="100vw"
            priority
          />
        </div>
        <div aria-hidden="true" className={styles.heroScrim} />

        <div data-stagger className={styles.heroInner}>
          <p data-reveal="y" className={styles.heroEyebrow}>
            {service.eyebrow} · {serviceDetail.eyebrowSuffix}
          </p>
          <h1 id="dt-h" data-reveal="y" className={styles.heroTitle}>
            {service.title}
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            {service.script}
          </p>
          <p data-reveal="y" className={styles.heroBlurb}>
            {service.blurb}
          </p>
          <div data-reveal="y" className={styles.heroActions}>
            <Link href="/contact" className="btn btnMd btnGold">
              {serviceDetail.heroCta.primary}
            </Link>
            <Link href="/services" className="btn btnMd btnGhost">
              {serviceDetail.heroCta.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="inc-h" className={styles.includes}>
        <div className={styles.includesGrid}>
          <div>
            <p data-reveal="y" className={styles.includesEyebrow}>
              {serviceDetail.includes.eyebrow}
            </p>
            <h2 id="inc-h" data-reveal="y" className={styles.includesTitle}>
              <Emphasis text={serviceDetail.includes.title} />
            </h2>
            <ul data-reveal="y" className={styles.includesChips}>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p data-reveal="y" className={styles.includesNote}>
              {serviceDetail.includes.note}
            </p>
          </div>

          <ul data-stagger className={styles.checklist}>
            {service.includes.map((item) => (
              <li key={item} data-reveal="y">
                <CheckMark className={styles.checkIcon} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="pk-h" className={styles.packages}>
        <div className="container">
          <p data-reveal="y" className={styles.packagesEyebrow}>
            {serviceDetail.packages.eyebrow}
          </p>
          <h2 id="pk-h" data-reveal="y" className={styles.packagesTitle}>
            <Emphasis text={serviceDetail.packages.title} />
          </h2>
          <p data-reveal="y" className={styles.packagesNote}>
            {serviceDetail.packages.note}
          </p>

          <div data-stagger className={styles.packageGrid}>
            {service.packages.map((pkg, index) => {
              const featured = index === 1;

              return (
                <article
                  key={pkg.tier}
                  data-reveal="y"
                  className={
                    featured
                      ? `${styles.packageCard} ${styles.packageFeatured}`
                      : styles.packageCard
                  }
                >
                  {featured && (
                    <span className={styles.ribbon}>
                      {serviceDetail.packages.ribbon}
                    </span>
                  )}
                  <p className={styles.packageTier}>{pkg.tier}</p>
                  <p className={styles.packageBest}>{pkg.best}</p>
                  <span aria-hidden="true" className="hairline" />
                  <ul className={styles.packagePoints}>
                    {pkg.points.map((point) => (
                      <li key={point}>
                        <span aria-hidden="true" className="diamond" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`btn btnOutlineGold ${styles.packageCta}`}
                  >
                    {fill(serviceDetail.packages.cta, { tier: pkg.tier })}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="gal-h" className={styles.gallery}>
        <div className="container">
          <p data-reveal="y" className={styles.galleryEyebrow}>
            {serviceDetail.gallery.eyebrow}
          </p>
          <h2 id="gal-h" data-reveal="y" className={styles.galleryTitle}>
            <Emphasis text={serviceDetail.gallery.title} />
          </h2>

          <div data-stagger className={styles.galleryGrid}>
            {service.gallery.map((caption, index) => (
              <figure
                key={caption}
                data-reveal="zoom"
                className={styles.galleryCard}
              >
                <div className={styles.galleryFrame}>
                  <Photo
                    slot={`svc-${service.slug}-${index}`}
                    asset={media[`svc-${service.slug}-${index}`]}
                    alt={caption}
                    sizes="(max-width: 700px) 100vw, 25vw"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-h" className={styles.faq}>
        <div className="containerProse">
          <p data-reveal="y" className={styles.faqEyebrow}>
            {serviceDetail.faq.eyebrow}
          </p>
          <h2 id="faq-h" data-reveal="y" className={styles.faqTitle}>
            <Emphasis text={serviceDetail.faq.title} />
          </h2>

          <FaqAccordion slug={service.slug} faqs={service.faqs} />

          <div data-reveal="y" className={styles.closingCard}>
            <p className={styles.closingScript}>
              {serviceDetail.closing.script}
            </p>
            <p className={styles.closingBody}>{serviceDetail.closing.body}</p>
            <Link href="/contact" className="btn btnMd btnGold">
              {serviceDetail.closing.cta}
            </Link>
          </div>

          <div data-reveal="y" className={styles.others}>
            <p className={styles.othersLabel}>{serviceDetail.othersLabel}</p>
            <div className={styles.othersRow}>
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={`/services/${sibling.slug}`}
                  className={styles.othersLink}
                >
                  {sibling.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
