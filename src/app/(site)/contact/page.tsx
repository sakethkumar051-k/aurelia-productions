import type { Metadata } from 'next';

import { Emphasis } from '@/components/emphasis';
import { EnquiryForm } from '@/components/enquiry-form';
import { getContent } from '@/lib/content';

import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us the date, the city and the dream. Aurevia replies within 48 hours with a mood board and a costed plan — or email our team for availability.',
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
                  href={contact.whatsapp || `mailto:${contact.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reachPrimary}
                >
                  {contact.whatsapp ? contactPage.reach.cta.primary : 'Email our team'}
                </a>
                {contact.instagram && <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reachSecondary}
                >
                  {contactPage.reach.cta.secondary}
                </a>}
              </div>
            </div>

            <div data-reveal="y" className={styles.studioCard}>
              <p className={styles.studioLabel}>{contactPage.studioLabel}</p>
              {contact.street && <p className={styles.studioLine}>{contact.street}</p>}
              {(contact.locality || contact.region) && <p className={styles.studioLine}>
                {[contact.locality, contact.region, contact.postalCode].filter(Boolean).join(', ')}
              </p>}
              <p className={styles.studioLine}>
                <a href={`mailto:${contact.email}`} className={styles.studioLink}>
                  {contact.email}
                </a>
                {contact.phone && contact.phoneHref && <> · <a href={`tel:${contact.phoneHref}`} className={styles.studioLink}>{contact.phone}</a></>}
              </p>
              <p className={styles.studioHours}>{contact.hours}</p>
            </div>

            {contact.street && <a data-reveal="y" className={styles.studioLink}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([contact.street, contact.locality, contact.region, contact.postalCode].filter(Boolean).join(', '))}`}
              target="_blank" rel="noopener noreferrer">View studio location ↗</a>}
          </div>
        </div>
      </section>
    </>
  );
}
