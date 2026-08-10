import type { Metadata } from 'next';
import Link from 'next/link';

import { Emphasis } from '@/components/emphasis';
import { LineIcon, LotusDivider } from '@/components/lotus-divider';
import { Marquee } from '@/components/marquee';
import { Photo } from '@/components/photo';
import { getContent } from '@/lib/content';

import styles from './home.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getContent();

  return {
    title: `${brand.name} — Events, Decor & Production across India`,
    description: brand.description,
    alternates: { canonical: '/' },
  };
}

export default async function HomePage() {
  const content = await getContent();
  const { home, media } = content;

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
              {home.hero.eyebrow}
            </p>

            <h1 id="hero-h" className={styles.heroTitle}>
              <span data-reveal="y">{home.hero.titleLine1}</span>
              <span data-reveal="y" className={styles.heroTitleItalic}>
                {home.hero.titleLine2}
              </span>
            </h1>

            <p data-reveal="y" className={styles.heroScript}>
              {home.hero.script}
            </p>

            <p data-reveal="y" className={styles.heroBody}>
              {home.hero.body}
            </p>

            <div data-reveal="y" className={styles.heroActions}>
              <Link href="/contact" className="btn btnLg btnGold btnGoldLift">
                {home.hero.cta.primary}
              </Link>
              <Link href="/services" className="btn btnLg btnGhost">
                {home.hero.cta.secondary}
              </Link>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className={styles.heroEdge} />
      </section>

      <Marquee words={home.marquee} />

      <section aria-labelledby="cat-h" className={styles.pillars}>
        <div className="container">
          <div data-stagger className={styles.sectionHead}>
            <p data-reveal="y" className={styles.sectionEyebrow}>
              {home.pillars.eyebrow}
            </p>
            <h2 id="cat-h" data-reveal="y" className={styles.sectionTitle}>
              <Emphasis text={home.pillars.title} />
            </h2>
            <LotusDivider className={styles.sectionDivider} />
            <p data-reveal="y" className={styles.sectionBody}>
              {home.pillars.body}
            </p>
          </div>

          <div data-stagger className={styles.pillarGrid}>
            {content.services.map((service) => (
              <article
                key={service.slug}
                data-reveal="y"
                className={styles.pillarCard}
              >
                <div className={styles.pillarFrame}>
                  <Photo
                    slot={`cat-${service.slug}`}
                    asset={media[`cat-${service.slug}`]}
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
                {home.featured.eyebrow}
              </p>
              <h2 id="feat-h" data-reveal="y" className={styles.featuredTitle}>
                <Emphasis text={home.featured.title} />
              </h2>
            </div>
            <Link
              data-reveal="y"
              href="/portfolio"
              className="btn btnSm btnGhost"
            >
              {home.featured.cta}
            </Link>
          </div>

          <div data-stagger className={styles.featuredGrid}>
            {home.featured.items.map((item) => (
              <figure
                key={item.slot}
                data-reveal="y"
                className={styles.featuredCard}
              >
                <div className={styles.featuredFrame}>
                  <Photo
                    slot={item.slot}
                    asset={media[item.slot]}
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
            {home.stats.map((stat) => (
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
            <Emphasis text={home.why.title} />
          </h2>
          <p data-reveal="y" className={styles.whyScript}>
            {home.why.script}
          </p>

          <div data-stagger className={styles.whyGrid}>
            {home.why.items.map((item) => (
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
            {home.testimonials.eyebrow}
          </p>
          <h2 id="test-h" data-reveal="y" className={styles.testimonialTitle}>
            <Emphasis text={home.testimonials.title} />
          </h2>

          <div data-stagger className={styles.testimonialGrid}>
            {home.testimonials.items.map((item) => (
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
            {home.closing.script}
          </p>
          <h2 id="cta-h" data-reveal="y" className={styles.closingTitle}>
            <Emphasis text={home.closing.title} />
          </h2>
          <p data-reveal="y" className={styles.closingBody}>
            {home.closing.body}
          </p>
          <div data-reveal="y" className={styles.closingActions}>
            <Link href="/contact" className="btn btnLg btnGold">
              {home.closing.cta.primary}
            </Link>
            <Link href="/festive-decor" className="btn btnLg btnGhost">
              {home.closing.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
