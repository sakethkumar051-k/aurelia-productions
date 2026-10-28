import Link from 'next/link';

import { Photo } from '@/components/photo';
import type { Content } from '@/content/schema';
import { siteNavigation } from '@/lib/navigation';

import styles from './site-footer.module.css';

export function SiteFooter({ content }: { content: Content }) {
  const { footer, contact, services, brand, header } = content;

  return (
    <footer className={styles.footer}>
      <div className={styles.strip}>
        <div className={styles.stripInner}>
          {footer.trustStrip.map((item) => (
            <span key={item} className={styles.stripItem}>
              {item}
              <span aria-hidden="true" className="diamond" />
            </span>
          ))}
        </div>
      </div>

      <div className={styles.columns}>
        <div>
          <Link href="/" aria-label={`${brand.name} — home`} className={styles.brandLogo}>
            <Photo slot="brand-logo" asset={content.media['brand-logo']} alt={brand.name} fit="contain" sizes="220px" />
          </Link>
          <p className={styles.brandScript}>{footer.script}</p>
          <p className={styles.brandBlurb}>{footer.blurb}</p>
        </div>

        <div>
          <p className={styles.colLabel}>{footer.pagesLabel}</p>
          <ul className={styles.colList}>
            {siteNavigation(header).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.colLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={styles.colLabel}>{footer.servicesLabel}</p>
          <ul className={styles.colList}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className={styles.colLink}
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={styles.colLabel}>{footer.enquiriesLabel}</p>
          <p className={styles.contactLine}>
            <a href={`mailto:${contact.email}`} className={styles.colLink}>
              {contact.email}
            </a>
          </p>
          {contact.phone && contact.phoneHref && <p className={styles.contactLine}>
            <a href={`tel:${contact.phoneHref}`} className={styles.colLink}>
              {contact.phone}
            </a>
          </p>}
          <p className={styles.contactLineLast}>{contact.cities}</p>
          <Link href="/contact" className={styles.footerCta}>
            {footer.cta}
          </Link>
        </div>
      </div>

      <div className={styles.legal}>
        <div className={styles.legalInner}>
          <p>{footer.legalLeft}</p>
          <p>{footer.legalRight}</p>
        </div>
      </div>
    </footer>
  );
}
