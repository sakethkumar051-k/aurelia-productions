import type { Metadata } from 'next';
import Link from 'next/link';

import { Emphasis, fill } from '@/components/emphasis';
import { CheckMark, LineIcon } from '@/components/lotus-divider';
import { Photo } from '@/components/photo';
import { getContent } from '@/lib/content';

import styles from './festive.module.css';

export const metadata: Metadata = {
  title: 'Festive Decor · Ganeshotsav',
  description:
    'Ganesh decor for homes, mandals and offices — makhar, backdrop, florals and lighting, designed, built and installed by our own crew, then taken down after visarjan.',
  alternates: { canonical: '/festive-decor' },
};

export default async function FestiveDecorPage() {
  const { festive, media } = await getContent();

  return (
    <>
      <section aria-labelledby="gn-h" className={styles.hero}>
        <div aria-hidden="true" className={styles.heroRing} />

        <div data-stagger className={styles.heroInner}>
          <p data-reveal="y" className={styles.heroEyebrow}>
            {festive.hero.eyebrow}
          </p>
          <h1 id="gn-h" data-reveal="y" className={styles.heroTitle}>
            <Emphasis text={festive.hero.title} />
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            {festive.hero.script}
          </p>
          <p data-reveal="y" className={styles.heroBody}>
            {festive.hero.body}
          </p>
          <div data-reveal="y" className={styles.heroActions}>
            <Link href="/contact" className="btn btnLg btnGold">
              {festive.hero.cta.primary}
            </Link>
            <Link href="/portfolio" className="btn btnLg btnGhost">
              {festive.hero.cta.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="wd-h" className={styles.wedo}>
        <div className="container">
          <h2 id="wd-h" data-reveal="y" className={styles.wedoTitle}>
            <Emphasis text={festive.wedo.title} />
          </h2>
          <p data-reveal="y" className={styles.wedoBody}>
            {festive.wedo.body}
          </p>

          <div data-stagger className={styles.wedoGrid}>
            {festive.wedo.items.map((item) => (
              <div key={item.t} data-reveal="y" className={styles.wedoCard}>
                <div aria-hidden="true" className={styles.wedoIcon}>
                  <LineIcon d={item.icon} size={26} />
                </div>
                <h3 className={styles.wedoCardTitle}>{item.t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cmp-h" className={styles.compare}>
        <div className="containerNarrow">
          <p data-reveal="y" className={styles.compareEyebrow}>
            {festive.compare.eyebrow}
          </p>
          <h2 id="cmp-h" data-reveal="y" className={styles.compareTitle}>
            <Emphasis text={festive.compare.title} />
          </h2>

          <div data-stagger className={styles.compareGrid}>
            {festive.compare.tiers.map((tier) => (
              <article
                key={tier.tier}
                data-reveal="y"
                className={
                  tier.featured
                    ? `${styles.tierCard} ${styles.tierFeatured}`
                    : styles.tierCard
                }
              >
                <div className={styles.tierFrame}>
                  <Photo
                    slot={tier.slot}
                    asset={media[tier.slot]}
                    alt={tier.alt}
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.tierBody}>
                  <div className={styles.tierHead}>
                    <p className={styles.tierName}>{tier.tier}</p>
                    <p className={styles.tierPrice}>{tier.price}</p>
                  </div>
                  <span aria-hidden="true" className="hairline" />
                  <ul className={styles.tierPoints}>
                    {tier.points.map((point) => (
                      <li key={point}>
                        <CheckMark
                          size={16}
                          strokeWidth={2}
                          className={styles.tierCheck}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`btn btnGold ${styles.tierCta}`}
                  >
                    {fill(festive.compare.cta, { tier: tier.tier })}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p data-reveal="y" className={styles.compareNote}>
            {festive.compare.note}
          </p>
        </div>
      </section>

      <section aria-label="Booking" className={styles.booking}>
        <div data-stagger className={styles.bookingInner}>
          <p data-reveal="y" className={styles.bookingScript}>
            {festive.booking.script}
          </p>
          <h2 data-reveal="y" className={styles.bookingTitle}>
            <Emphasis text={festive.booking.title} />
          </h2>
          <p data-reveal="y" className={styles.bookingBody}>
            {festive.booking.body}
          </p>
          <div data-reveal="y" className={styles.bookingActions}>
            <Link href="/contact" className="btn btnLg btnGold">
              {festive.booking.cta.primary}
            </Link>
            <Link href="/services" className="btn btnLg btnGhost">
              {festive.booking.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
