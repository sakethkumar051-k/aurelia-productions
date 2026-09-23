import Link from 'next/link';

import { Emphasis } from '@/components/emphasis';
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
      <SiteHeader content={content} />
      <main id="main">
        <section aria-labelledby="nf-h" className={styles.wrap}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{content.notFound.eyebrow}</p>
            <h1 id="nf-h" className={styles.title}>
              <Emphasis text={content.notFound.title} />
            </h1>
            <LotusDivider className={styles.divider} />
            <p className={styles.body}>
              {content.notFound.body}
            </p>
            <div className={styles.actions}>
              <Link href="/" className="btn btnLg btnGold">
                {content.notFound.homeCta}
              </Link>
              <Link href="/contact" className="btn btnLg btnGhost">
                {content.notFound.contactCta}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
