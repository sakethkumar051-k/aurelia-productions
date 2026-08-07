import Link from 'next/link';

import { LotusDivider } from '@/components/lotus-divider';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <section aria-labelledby="nf-h" className={styles.wrap}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>404 · Page not found</p>
        <h1 id="nf-h" className={styles.title}>
          This page has <span className="em">wrapped up</span>
        </h1>
        <LotusDivider className={styles.divider} />
        <p className={styles.body}>
          The link you followed no longer leads anywhere. The work, the pillars
          and the enquiry form are all still where you left them.
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
  );
}
