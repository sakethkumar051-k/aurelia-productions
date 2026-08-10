import type { Metadata } from 'next';
import Link from 'next/link';

import { Emphasis, fill } from '@/components/emphasis';
import { Photo } from '@/components/photo';
import { getContent } from '@/lib/content';

import styles from './services.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Five pillars — weddings, decor, photography and film, entertainment and talent, corporate and brand. Each with its own team, its own detail page and open costing.',
  alternates: { canonical: '/services' },
};

export default async function ServicesPage() {
  const { servicesPage, services, media } = await getContent();

  return (
    <>
      <section aria-labelledby="sv-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            {servicesPage.hero.eyebrow}
          </p>
          <h1 id="sv-h" data-reveal="y" className={styles.heroTitle}>
            <Emphasis text={servicesPage.hero.title} />
          </h1>
          <p data-reveal="y" className={styles.heroBody}>
            {servicesPage.hero.body}
          </p>
        </div>
      </section>

      <section aria-label="Service pillars" className={styles.pillars}>
        <div className={styles.pillarStack}>
          {services.map((service) => (
            <article
              key={service.slug}
              data-stagger
              className={styles.pillarRow}
            >
              <div data-reveal="zoom" className={styles.pillarFigure}>
                <div className={styles.pillarFrame}>
                  <Photo
                    slot={`cat-${service.slug}`}
                    asset={media[`cat-${service.slug}`]}
                    alt={service.hero}
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div>
                <div data-reveal="y" className={styles.pillarBadge}>
                  {service.eyebrow}
                </div>
                <h2 data-reveal="y" className={styles.pillarTitle}>
                  {service.title}
                </h2>
                <p data-reveal="y" className={styles.pillarScript}>
                  {service.script}
                </p>
                <p data-reveal="y" className={styles.pillarBlurb}>
                  {service.blurb}
                </p>
                <ul data-reveal="y" className={styles.pillarChips}>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div data-reveal="y" className={styles.pillarCta}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn btnSm btnGhostFill"
                  >
                    {fill(servicesPage.rowCta, { name: service.short })}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="extra-h" className={styles.extras}>
        <div className="container">
          <p data-reveal="y" className={styles.extrasEyebrow}>
            {servicesPage.extras.eyebrow}
          </p>
          <h2 id="extra-h" data-reveal="y" className={styles.extrasTitle}>
            <Emphasis text={servicesPage.extras.title} />
          </h2>

          <div data-stagger className={styles.extrasGrid}>
            {servicesPage.extras.items.map((extra) => (
              <div key={extra.t} data-reveal="y" className={styles.extrasCard}>
                <h3 className={styles.extrasCardTitle}>{extra.t}</h3>
                <p className={styles.extrasCardBody}>{extra.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
