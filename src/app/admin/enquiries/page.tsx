import { requireAdmin } from '@/lib/auth';
import { firestore } from '@/lib/firebase/admin';

import styles from '../admin.module.css';

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  type: string;
  date: string;
  city: string;
  budget: string;
  message: string;
  receivedAt: string;
};

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}

async function loadEnquiries(): Promise<Enquiry[] | null> {
  const db = firestore();
  if (!db) return null;

  try {
    const snapshot = await db
      .collection('enquiries')
      .orderBy('receivedAt', 'desc')
      .limit(100)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Enquiry, 'id'>),
    }));
  } catch (error) {
    console.error('[admin] enquiries read failed:', error);
    return null;
  }
}

export default async function EnquiriesPage() {
  await requireAdmin();
  const enquiries = await loadEnquiries();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageEyebrow}>Newest first · last 100</p>
          <h1 className={styles.pageTitle}>Enquiries</h1>
          <p className={styles.pageHint}>
            Everything sent through the contact form. Each one is also delivered
            by email, so this is the archive rather than the alert.
          </p>
        </div>
      </div>

      {enquiries === null && (
        <div className={`${styles.notice} ${styles.noticeWarn}`}>
          Could not read enquiries. Check that Firestore is configured and that
          the <code>enquiries</code> collection exists.
        </div>
      )}

      {enquiries?.length === 0 && (
        <p className={styles.empty}>
          No enquiries yet. The next one sent through the contact form appears
          here.
        </p>
      )}

      {enquiries?.map((enquiry) => (
        <article key={enquiry.id} className={styles.enquiry}>
          <div className={styles.enquiryHead}>
            <h2 className={styles.enquiryName}>
              {enquiry.name || 'Unnamed enquiry'}
            </h2>
            <p className={styles.enquiryWhen}>{formatWhen(enquiry.receivedAt)}</p>
          </div>

          <div className={styles.enquiryGrid}>
            <p className={styles.enquiryField}>
              <span className={styles.enquiryFieldLabel}>Phone</span>
              {enquiry.phone ? (
                <a href={`tel:${enquiry.phone.replace(/\s/g, '')}`}>
                  {enquiry.phone}
                </a>
              ) : (
                '—'
              )}
            </p>
            <p className={styles.enquiryField}>
              <span className={styles.enquiryFieldLabel}>Event type</span>
              {enquiry.type || '—'}
            </p>
            <p className={styles.enquiryField}>
              <span className={styles.enquiryFieldLabel}>Date</span>
              {enquiry.date || '—'}
            </p>
            <p className={styles.enquiryField}>
              <span className={styles.enquiryFieldLabel}>City</span>
              {enquiry.city || '—'}
            </p>
            <p className={styles.enquiryField}>
              <span className={styles.enquiryFieldLabel}>Budget</span>
              {enquiry.budget || '—'}
            </p>
            {enquiry.message && (
              <p className={`${styles.enquiryField} ${styles.enquiryMessage}`}>
                <span className={styles.enquiryFieldLabel}>Message</span>
                {enquiry.message}
              </p>
            )}
          </div>
        </article>
      ))}
    </>
  );
}
