import Link from 'next/link';

import { SECTION_META } from '@/content/sections';
import { getImage } from '@/content/images';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryServerConfigured } from '@/lib/cloudinary-server';
import { getContentFresh } from '@/lib/content';
import { isFirebaseConfigured } from '@/lib/firebase/admin';
import { mediaSlots } from '@/lib/media-slots';

import styles from './admin.module.css';

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const content = await getContentFresh();

  const slots = mediaSlots(content);
  const photoSlots = slots.filter((slot) => content.media[slot.slot] || getImage(slot.slot)).length;

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageEyebrow}>Signed in as {admin.email}</p>
          <h1 className={styles.pageTitle}>Site content</h1>
          <p className={styles.pageHint}>
            Everything below is live copy. Edit a section, press Save, and the
            change appears on the site immediately — no deploy needed.
          </p>
        </div>
      </div>

      {!isFirebaseConfigured() && (
        <div className={`${styles.notice} ${styles.noticeWarn}`}>
          Firestore is not configured, so edits cannot be saved. The site is
          rendering its built-in copy.
        </div>
      )}

      {(!isCloudinaryServerConfigured() || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) && (
        <div className={`${styles.notice} ${styles.noticeInfo}`}>
          Cloudinary is not configured yet, so photo uploads are unavailable.
          Add <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code>{' '}
          and <code>CLOUDINARY_API_SECRET</code>, plus the public cloud name,
          to enable them.
        </div>
      )}

      <div className={styles.cards}>
        <Link href="/admin/media" className={styles.card}>
          <h2 className={styles.cardTitle}>Photographs</h2>
          <p className={styles.cardBody}>
            Upload and replace the images in every frame across the site.
          </p>
          <p className={styles.cardMeta}>{photoSlots} of {slots.length} filled</p>
        </Link>

        <Link href="/admin/enquiries" className={styles.card}>
          <h2 className={styles.cardTitle}>Enquiries</h2>
          <p className={styles.cardBody}>
            Everything sent through the contact form, newest first.
          </p>
          <p className={styles.cardMeta}>Inbox</p>
        </Link>

        {SECTION_META.map((section) => (
          <Link
            key={section.key}
            href={`/admin/${section.key}`}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>{section.label}</h2>
            <p className={styles.cardBody}>{section.description}</p>
            <p className={styles.cardMeta}>{section.group}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
