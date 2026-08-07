import type { Metadata } from 'next';

import { PortfolioGallery } from '@/components/portfolio-gallery';

import styles from './portfolio.module.css';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Weddings, decor, festive sets, photography, entertainment and corporate stages from across India — filter by craft and open any frame larger.',
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioPage() {
  return (
    <>
      <section aria-labelledby="pf-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            Portfolio
          </p>
          <h1 id="pf-h" data-reveal="y" className={styles.heroTitle}>
            Moments that <span className="em">lasted</span>
          </h1>
          <p data-reveal="y" className={styles.heroBody}>
            Filter by craft. Tap any frame to open it larger.
          </p>
        </div>
      </section>

      <section aria-label="Gallery" className={styles.gallery}>
        <div className="container">
          <PortfolioGallery />
        </div>
      </section>
    </>
  );
}
