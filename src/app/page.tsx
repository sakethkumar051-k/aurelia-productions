import type { Metadata } from 'next';
import Link from 'next/link';

import { LineIcon, LotusDivider } from '@/components/lotus-divider';
import { Marquee } from '@/components/marquee';
import { Photo } from '@/components/photo';
import { SERVICES } from '@/content/services';
import { FEATURED, STATS, TESTIMONIALS, TRUST } from '@/content/site';

import styles from './home.module.css';

export const metadata: Metadata = {
  title: 'The Aurevia Productions — Events, Decor & Production across India',
  description:
    'Weddings, festive decor, photography, entertainment and corporate production — designed in-house and executed to the minute, from Pune and Mumbai to the rest of India.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-h" className={styles.hero}>
        <div
          aria-hidden="true"
          data-parallax="0.18"
          className={styles.heroLayer}
        />
        <div aria-hidden="true" className={styles.heroRingLarge} />
        <div aria-hidden="true" className={styles.heroRingSmall} />

        <div className={styles.heroInner}>
          <div data-stagger className={styles.heroCopy}>
            <p data-reveal="y" className={styles.heroEyebrow}>
              <span aria-hidden="true" data-reveal="x" className={styles.heroRule} />
              Event Management · Decor · Production · India
            </p>

            <h1 id="hero-h" className={styles.heroTitle}>
              <span data-reveal="y">The Aurevia</span>
              <span data-reveal="y" className={styles.heroTitleItalic}>
                Productions
              </span>
            </h1>

            <p data-reveal="y" className={styles.heroScript}>
              Events | Decor | Moments That Last
            </p>

            <p data-reveal="y" className={styles.heroBody}>
              We customize, You celebrate. A design-led house staging weddings,
              festivals and brand spectacles across India — drawn by hand,
              executed to the minute.
            </p>

            <div data-reveal="y" className={styles.heroActions}>
              <Link href="/contact" className="btn btnLg btnGold btnGoldLift">
                Book Your Dates Now
              </Link>
              <Link href="/services" className="btn btnLg btnGhost">
                View Our Services
              </Link>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className={styles.heroEdge} />
      </section>

      <Marquee />

      <section aria-labelledby="cat-h" className={styles.pillars}>
        <div className="container">
          <div data-stagger className={styles.sectionHead}>
            <p data-reveal="y" className={styles.sectionEyebrow}>
              What we do
            </p>
            <h2 id="cat-h" data-reveal="y" className={styles.sectionTitle}>
              Five pillars, one <span className="em">atelier</span>
            </h2>
            <LotusDivider className={styles.sectionDivider} />
            <p data-reveal="y" className={styles.sectionBody}>
              Every mandap, every frame, every cue sheet is made for one family
              or one brand — never repeated.
            </p>
          </div>

          <div data-stagger className={styles.pillarGrid}>
            {SERVICES.map((service) => (
              <article
                key={service.slug}
                data-reveal="y"
                className={styles.pillarCard}
              >
                <div className={styles.pillarFrame}>
                  <Photo
                    slot={`cat-${service.slug}`}
                    alt={service.hero}
                    sizes="(max-width: 700px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.pillarBody}>
                  <p className={styles.pillarEyebrow}>{service.eyebrow}</p>
                  <h3 className={styles.pillarTitle}>{service.title}</h3>
                  <p className={styles.pillarBlurb}>{service.blurb}</p>
                  <ul className={styles.pillarList}>
                    {service.items.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true" className="diamond" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className={styles.pillarLink}
                  >
                    Explore {service.short} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="feat-h" className={styles.featured}>
        <div className="container">
          <div data-stagger className={styles.featuredHead}>
            <div>
              <p data-reveal="y" className={styles.featuredEyebrow}>
                Featured work
              </p>
              <h2 id="feat-h" data-reveal="y" className={styles.featuredTitle}>
                Recent <span className="em">celebrations</span>
              </h2>
            </div>
            <Link
              data-reveal="y"
              href="/portfolio"
              className="btn btnSm btnGhost"
            >
              Full Portfolio
            </Link>
          </div>

          <div data-stagger className={styles.featuredGrid}>
            {FEATURED.map((item) => (
              <figure
                key={item.slot}
                data-reveal="y"
                className={styles.featuredCard}
              >
                <div className={styles.featuredFrame}>
                  <Photo
                    slot={item.slot}
                    alt={item.alt}
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                </div>
                <figcaption className={styles.featuredCaption}>
                  <p className={styles.featuredCat}>{item.cat}</p>
                  <h3 className={styles.featuredName}>{item.title}</h3>
                  <p className={styles.featuredPlace}>{item.place}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div data-stagger className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} data-reveal="y" className={styles.statCell}>
                <p className={styles.statNumber}>
                  <span data-count={stat.n}>{stat.n}</span>
                  {stat.suffix}
                </p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="why-h" className={styles.why}>
        <div className="container">
          <h2 id="why-h" data-reveal="y" className={styles.whyTitle}>
            Why families and brands <span className="em">choose us</span>
          </h2>
          <p data-reveal="y" className={styles.whyScript}>
            We customize, You celebrate.
          </p>

          <div data-stagger className={styles.whyGrid}>
            {TRUST.map((item) => (
              <div key={item.title} data-reveal="y" className={styles.whyCard}>
                <div aria-hidden="true" className={styles.whyIcon}>
                  <LineIcon d={item.icon} />
                </div>
                <h3 className={styles.whyCardTitle}>{item.title}</h3>
                <p className={styles.whyCardBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="test-h" className={styles.testimonials}>
        <div className="containerNarrow">
          <p data-reveal="y" className={styles.testimonialEyebrow}>
            Kind words
          </p>
          <h2 id="test-h" data-reveal="y" className={styles.testimonialTitle}>
            Moments that <span className="em">lasted</span>
          </h2>

          <div data-stagger className={styles.testimonialGrid}>
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                data-reveal="y"
                className={styles.quote}
              >
                <span aria-hidden="true" className={styles.quoteMark}>
                  &ldquo;
                </span>
                <p className={styles.quoteText}>{item.quote}</p>
                <footer className={styles.quoteFooter}>
                  <p className={styles.quoteName}>{item.name}</p>
                  <p className={styles.quoteMeta}>{item.meta}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-h" className={styles.closing}>
        <div data-stagger className={styles.closingInner}>
          <p data-reveal="y" className={styles.closingScript}>
            Let&rsquo;s begin
          </p>
          <h2 id="cta-h" data-reveal="y" className={styles.closingTitle}>
            Your date is still <span className="em">open</span>
          </h2>
          <p data-reveal="y" className={styles.closingBody}>
            Tell us the city, the date and the dream. We send back a mood board
            and a costed plan within 48 hours.
          </p>
          <div data-reveal="y" className={styles.closingActions}>
            <Link href="/contact" className="btn btnLg btnGold">
              Get a Custom Quote
            </Link>
            <Link href="/festive-decor" className="btn btnLg btnGhost">
              Festive Decor 2026
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
