import type { Metadata } from 'next';

import { Emphasis } from '@/components/emphasis';
import { EnquiryForm } from '@/components/enquiry-form';
import { getContent } from '@/lib/content';

import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us the date, the city and the dream. Aurevia replies within 48 hours with a mood board and a costed plan — or WhatsApp us for same-day availability.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const { contactPage, contact } = await getContent();

  return (
    <>
      <section aria-labelledby="ct-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            {contactPage.hero.eyebrow}
          </p>
          <h1 id="ct-h" data-reveal="y" className={styles.heroTitle}>
            <Emphasis text={contactPage.hero.title} />
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            {contactPage.hero.script}
          </p>
        </div>
      </section>

      <section aria-label="Enquiry" className={styles.enquiry}>
        <div className={styles.grid}>
          <div data-stagger className={styles.formCard}>
            <EnquiryForm copy={contactPage} fallbackPhone={contact.phone} />
          </div>

          <div data-stagger className={styles.aside}>
            <div data-reveal="y" className={styles.reachCard}>
              <p className={styles.reachEyebrow}>{contactPage.reach.eyebrow}</p>
              <h2 className={styles.reachTitle}>{contactPage.reach.title}</h2>
              <p className={styles.reachBody}>{contactPage.reach.body}</p>
              <div className={styles.reachActions}>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reachPrimary}
                >
                  {contactPage.reach.cta.primary}
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reachSecondary}
                >
                  {contactPage.reach.cta.secondary}
                </a>
              </div>
            </div>

            <div data-reveal="y" className={styles.studioCard}>
              <p className={styles.studioLabel}>{contactPage.studioLabel}</p>
              <p className={styles.studioLine}>{contact.street}</p>
              <p className={styles.studioLine}>
                {contact.locality}, {contact.region} {contact.postalCode}
              </p>
              <p className={styles.studioLine}>
                <a href={`mailto:${contact.email}`} className={styles.studioLink}>
                  {contact.email}
                </a>{' '}
                ·{' '}
                <a href={`tel:${contact.phoneHref}`} className={styles.studioLink}>
                  {contact.phone}
                </a>
              </p>
              <p className={styles.studioHours}>{contact.hours}</p>
            </div>

            <div
              data-reveal="y"
              role="img"
              aria-label={`Map placeholder showing the studio location in ${contact.locality}`}
              className={styles.map}
            >
              <div aria-hidden="true" className={styles.mapPin} />
              <div aria-hidden="true" className={styles.mapCaption}>
                {contactPage.mapCaption}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
