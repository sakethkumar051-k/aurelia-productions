import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FaqAccordion } from '@/components/faq-accordion';
import { CheckMark } from '@/components/lotus-divider';
import { Photo } from '@/components/photo';
import { SERVICES, getService, otherServices } from '@/content/services';
import { SITE } from '@/content/site';
import { siteUrl } from '@/lib/site-url';

import styles from './service.module.css';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.blurb,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} · ${SITE.shortName}`,
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
  const service = getService(slug);

  if (!service) notFound();

  const siblings = otherServices(service.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        description: service.blurb,
        serviceType: service.items,
        url: `${siteUrl()}/services/${service.slug}`,
        provider: { '@type': 'LocalBusiness', name: SITE.name },
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
            alt={service.hero}
            sizes="100vw"
            priority
          />
        </div>
        <div aria-hidden="true" className={styles.heroScrim} />

        <div data-stagger className={styles.heroInner}>
          <p data-reveal="y" className={styles.heroEyebrow}>
            {service.eyebrow} · Services
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
              Get a Custom Quote
            </Link>
            <Link href="/services" className="btn btnMd btnGhost">
              All Services
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="inc-h" className={styles.includes}>
        <div className={styles.includesGrid}>
          <div>
            <p data-reveal="y" className={styles.includesEyebrow}>
              What&rsquo;s included
            </p>
            <h2 id="inc-h" data-reveal="y" className={styles.includesTitle}>
              Handled <span className="em">end to end</span>
            </h2>
            <ul data-reveal="y" className={styles.includesChips}>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p data-reveal="y" className={styles.includesNote}>
              Every line below is quoted openly. Remove what you don&rsquo;t
              need — the plan flexes, the standard doesn&rsquo;t.
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
            Packages
          </p>
          <h2 id="pk-h" data-reveal="y" className={styles.packagesTitle}>
            Normal · Premium · <span className="em">Bespoke</span>
          </h2>
          <p data-reveal="y" className={styles.packagesNote}>
            Tiers are a starting shape, not a cage. Final costing follows your
            guest count, city and dates.
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
                  {featured && <span className={styles.ribbon}>Most chosen</span>}
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
                    Enquire · {pkg.tier}
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
            Gallery
          </p>
          <h2 id="gal-h" data-reveal="y" className={styles.galleryTitle}>
            From recent <span className="em">projects</span>
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
            Questions
          </p>
          <h2 id="faq-h" data-reveal="y" className={styles.faqTitle}>
            Before you <span className="em">enquire</span>
          </h2>

          <FaqAccordion slug={service.slug} faqs={service.faqs} />

          <div data-reveal="y" className={styles.closingCard}>
            <p className={styles.closingScript}>Shall we begin?</p>
            <p className={styles.closingBody}>
              Send us the date and city. A costed plan and a mood board come back
              within 48 hours.
            </p>
            <Link href="/contact" className="btn btnMd btnGold">
              DM for Booking
            </Link>
          </div>

          <div data-reveal="y" className={styles.others}>
            <p className={styles.othersLabel}>Other pillars</p>
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
