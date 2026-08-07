import type { Metadata } from 'next';

import { EnquiryForm } from '@/components/enquiry-form';
import { SITE } from '@/content/site';

import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us the date, the city and the dream. Aurevia replies within 48 hours with a mood board and a costed plan — or WhatsApp us for same-day availability.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <section aria-labelledby="ct-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            Contact
          </p>
          <h1 id="ct-h" data-reveal="y" className={styles.heroTitle}>
            Tell us the <span className="em">date</span>
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            We customize, You celebrate.
          </p>
        </div>
      </section>

      <section aria-label="Enquiry" className={styles.enquiry}>
        <div className={styles.grid}>
          <div data-stagger className={styles.formCard}>
            <EnquiryForm />
          </div>

          <div data-stagger className={styles.aside}>
            <div data-reveal="y" className={styles.reachCard}>
              <p className={styles.reachEyebrow}>Faster than email</p>
              <h2 className={styles.reachTitle}>WhatsApp &amp; DM</h2>
              <p className={styles.reachBody}>
                Send the date, city and a reference photo. We revert with
                availability the same day.
              </p>
              <div className={styles.reachActions}>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reachPrimary}
                >
                  WhatsApp Us
                </a>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reachSecondary}
                >
                  DM on Instagram
                </a>
              </div>
            </div>

            <div data-reveal="y" className={styles.studioCard}>
              <p className={styles.studioLabel}>Studio</p>
              <p className={styles.studioLine}>{SITE.address.street}</p>
              <p className={styles.studioLine}>
                {SITE.address.locality}, {SITE.address.region}{' '}
                {SITE.address.postalCode}
              </p>
              <p className={styles.studioLine}>
                <a href={`mailto:${SITE.email}`} className={styles.studioLink}>
                  {SITE.email}
                </a>{' '}
                ·{' '}
                <a href={`tel:${SITE.phoneHref}`} className={styles.studioLink}>
                  {SITE.phone}
                </a>
              </p>
              <p className={styles.studioHours}>{SITE.hours}</p>
            </div>

            <div
              data-reveal="y"
              role="img"
              aria-label="Map placeholder showing the studio location in Baner, Pune"
              className={styles.map}
            >
              <div aria-hidden="true" className={styles.mapPin} />
              <div aria-hidden="true" className={styles.mapCaption}>
                Map placeholder · Baner, Pune
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
