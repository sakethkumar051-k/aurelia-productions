import type { Metadata } from 'next';

import { Emphasis } from '@/components/emphasis';
import { PortfolioGallery } from '@/components/portfolio-gallery';
import { getContent, portfolioFilters } from '@/lib/content';

import styles from './portfolio.module.css';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Weddings, decor, festive sets, photography, entertainment and corporate stages from across India — filter by craft and open any frame larger.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioPage() {
  const content = await getContent();
  const { portfolio, media } = content;

  return (
    <>
      <section aria-labelledby="pf-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            {portfolio.hero.eyebrow}
          </p>
          <h1 id="pf-h" data-reveal="y" className={styles.heroTitle}>
            <Emphasis text={portfolio.hero.title} />
          </h1>
          <p data-reveal="y" className={styles.heroBody}>
            {portfolio.hero.body}
          </p>
        </div>
      </section>

      <section aria-label="Gallery" className={styles.gallery}>
        <div className="container">
          <PortfolioGallery
            items={portfolio.items}
            filters={portfolioFilters(content)}
            media={media}
          />
        </div>
      </section>
    </>
  );
}
