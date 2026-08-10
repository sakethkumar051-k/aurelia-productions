import { MediaManager } from '@/components/admin/media-manager';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryServerConfigured } from '@/lib/cloudinary-server';
import { getContentFresh } from '@/lib/content';
import { groupSlots, mediaSlots } from '@/lib/media-slots';

import styles from '../admin.module.css';

export default async function MediaPage() {
  await requireAdmin();

  const content = await getContentFresh();
  const slots = mediaSlots(content);
  const filled = slots.filter((slot) => content.media[slot.slot]).length;

  const uploadsEnabled = isCloudinaryServerConfigured();
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    process.env.CLOUDINARY_CLOUD_NAME ??
    '';

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageEyebrow}>
            {filled} of {slots.length} frames filled
          </p>
          <h1 className={styles.pageTitle}>Photographs</h1>
          <p className={styles.pageHint}>
            Each card is one frame on the site. Where no photograph has been
            uploaded, the site shows a placeholder describing the shot that
            belongs there. Uploads go straight to Cloudinary and appear on the
            site as soon as they finish.
          </p>
        </div>
      </div>

      {!uploadsEnabled && (
        <div className={`${styles.notice} ${styles.noticeWarn}`}>
          Cloudinary is not configured, so uploading is disabled. Add these to
          your environment and restart:
          <code className={styles.noticeCode}>
            {[
              'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name',
              'CLOUDINARY_CLOUD_NAME=your-cloud-name',
              'CLOUDINARY_API_KEY=...',
              'CLOUDINARY_API_SECRET=...',
            ].join('\n')}
          </code>
        </div>
      )}

      <MediaManager
        groups={groupSlots(slots)}
        media={content.media}
        cloudName={cloudName}
        uploadsEnabled={uploadsEnabled}
      />
    </>
  );
}
