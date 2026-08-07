import type { Metadata } from 'next';
import Link from 'next/link';

import { CheckMark, LineIcon } from '@/components/lotus-divider';
import { Photo } from '@/components/photo';
import { GANESH_DO, GANESH_TIERS } from '@/content/site';

import styles from './festive.module.css';

export const metadata: Metadata = {
  title: 'Festive Decor · Ganeshotsav',
  description:
    'Ganesh decor for homes, mandals and offices — makhar, backdrop, florals and lighting, designed, built and installed by our own crew, then taken down after visarjan.',
  alternates: { canonical: '/festive-decor' },
};

export default function FestiveDecorPage() {
  return (
    <>
      <section aria-labelledby="gn-h" className={styles.hero}>
        <div aria-hidden="true" className={styles.heroRing} />

        <div data-stagger className={styles.heroInner}>
          <p data-reveal="y" className={styles.heroEyebrow}>
            Festive Decor · Ganeshotsav 2026
          </p>
          <h1 id="gn-h" data-reveal="y" className={styles.heroTitle}>
            Celebrate Bappa with <span className="em">Love &amp; Beauty</span>
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            Normal to Premium · Homes, Mandals &amp; Offices
          </p>
          <p data-reveal="y" className={styles.heroBody}>
            Makhar, backdrop, florals and lighting — designed, built and
            installed by our own crew, then taken down after visarjan.
          </p>
          <div data-reveal="y" className={styles.heroActions}>
            <Link href="/contact" className="btn btnLg btnGold">
              Book Your Dates Now
            </Link>
            <Link href="/portfolio" className="btn btnLg btnGhost">
              See Festive Work
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="wd-h" className={styles.wedo}>
        <div className="container">
          <h2 id="wd-h" data-reveal="y" className={styles.wedoTitle}>
            We <span className="em">do</span>
          </h2>
          <p data-reveal="y" className={styles.wedoBody}>
            Pick the whole set or just the pieces your mandal still needs.
          </p>

          <div data-stagger className={styles.wedoGrid}>
            {GANESH_DO.map((item) => (
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
            Packages
          </p>
          <h2 id="cmp-h" data-reveal="y" className={styles.compareTitle}>
            Normal vs <span className="em">Premium</span>
          </h2>

          <div data-stagger className={styles.compareGrid}>
            {GANESH_TIERS.map((tier) => (
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
                    Book {tier.tier}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p data-reveal="y" className={styles.compareNote}>
            Both tiers include installation, daily touch-ups on request and full
            teardown after visarjan. Custom themes are quoted on drawing.
          </p>
        </div>
      </section>

      <section aria-label="Booking" className={styles.booking}>
        <div data-stagger className={styles.bookingInner}>
          <p data-reveal="y" className={styles.bookingScript}>
            Ganpati Bappa Morya
          </p>
          <h2 data-reveal="y" className={styles.bookingTitle}>
            Book Your Dates Now!
          </h2>
          <p data-reveal="y" className={styles.bookingBody}>
            Festive slots fill six weeks ahead. Send your lane, your idol height
            and your budget — we revert with a drawing.
          </p>
          <div data-reveal="y" className={styles.bookingActions}>
            <Link href="/contact" className="btn btnLg btnGold">
              DM for Booking
            </Link>
            <Link href="/services" className="btn btnLg btnGhost">
              All Decor Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
