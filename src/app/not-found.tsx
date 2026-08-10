import Link from 'next/link';

import { LotusDivider } from '@/components/lotus-divider';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getContent } from '@/lib/content';

import styles from './not-found.module.css';

/**
 * Global 404. It sits above the `(site)` group — which owns the site chrome —
 * so it brings its own header and footer.
 */
export default async function NotFound() {
  const content = await getContent();

  return (
    <>
      <div aria-hidden="true" className="grain" />
      <SiteHeader ctaLabel={content.header.cta} />
      <main id="main">
        <section aria-labelledby="nf-h" className={styles.wrap}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>404 · Page not found</p>
            <h1 id="nf-h" className={styles.title}>
              This page has <span className="em">wrapped up</span>
            </h1>
            <LotusDivider className={styles.divider} />
            <p className={styles.body}>
              The link you followed no longer leads anywhere. The work, the
              pillars and the enquiry form are all still where you left them.
            </p>
            <div className={styles.actions}>
              <Link href="/" className="btn btnLg btnGold">
                Back to Home
              </Link>
              <Link href="/contact" className="btn btnLg btnGhost">
                Talk to Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
