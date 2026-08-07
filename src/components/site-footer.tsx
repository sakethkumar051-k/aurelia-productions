import Link from 'next/link';

import { FOOTER_SERVICES, NAV, SITE, TRUST_STRIP } from '@/content/site';

import styles from './site-footer.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.strip}>
        <div className={styles.stripInner}>
          {TRUST_STRIP.map((item) => (
            <span key={item} className={styles.stripItem}>
              {item}
              <span aria-hidden="true" className="diamond" />
            </span>
          ))}
        </div>
      </div>

      <div className={styles.columns}>
        <div>
          <p className={styles.brandName}>Aurevia</p>
          <p className={styles.brandSub}>Productions</p>
          <p className={styles.brandScript}>Moments that last</p>
          <p className={styles.brandBlurb}>
            Events, decor and production — pan India, from intimate ceremonies to
            city-scale festivals.
          </p>
        </div>

        <div>
          <p className={styles.colLabel}>Pages</p>
          <ul className={styles.colList}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.colLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={styles.colLabel}>Services</p>
          <ul className={styles.colList}>
            {FOOTER_SERVICES.map((service) => (
              <li key={service.href}>
                <Link href={service.href} className={styles.colLink}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={styles.colLabel}>Enquiries</p>
          <p className={styles.contactLine}>
            <a href={`mailto:${SITE.email}`} className={styles.colLink}>
              {SITE.email}
            </a>
          </p>
          <p className={styles.contactLine}>
            <a href={`tel:${SITE.phoneHref}`} className={styles.colLink}>
              {SITE.phone}
            </a>
          </p>
          <p className={styles.contactLineLast}>{SITE.cities}</p>
          <Link href="/contact" className={styles.footerCta}>
            DM for Booking
          </Link>
        </div>
      </div>

      <div className={styles.legal}>
        <div className={styles.legalInner}>
          <p>© 2026 The Aurevia Productions. All rights reserved.</p>
          <p>Events | Decor | Moments That Last</p>
        </div>
      </div>
    </footer>
  );
}
