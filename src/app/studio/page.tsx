import type { Metadata } from 'next';

import { VisualStudio } from '@/components/admin/visual-studio';
import { getImage } from '@/content/images';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryServerConfigured } from '@/lib/cloudinary-server';
import { getContentFresh } from '@/lib/content';
import { mediaSlots } from '@/lib/media-slots';

export const metadata: Metadata = {
  title: 'Visual editor',
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function StudioPage() {
  const admin = await requireAdmin();
  const content = await getContentFresh();
  const slots = mediaSlots(content);
  const bundled = Object.fromEntries(slots.flatMap((slot) => {
    const image = getImage(slot.slot);
    return image ? [[slot.slot, image.src]] : [];
  }));

  return (
    <VisualStudio
      email={admin.email}
      initialContent={content}
      slots={slots}
      bundled={bundled}
      cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME ?? ''}
      uploadsEnabled={isCloudinaryServerConfigured() && Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)}
    />
  );
}
