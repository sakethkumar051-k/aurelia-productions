import Image from 'next/image';

import type { MediaAsset } from '@/content/schema';
import { getImage } from '@/content/images';
import { blurUrl, cloudinaryLoader, isCloudinaryConfigured } from '@/lib/cloudinary';

import styles from './photo.module.css';

type PhotoProps = {
  /** Stable slot id from the design handoff — see `src/content/images.ts`. */
  slot: string;
  /** Art-direction brief; doubles as the alt text until the real shot lands. */
  alt: string;
  /** Cloudinary asset for this slot, resolved by the page from site content. */
  asset?: MediaAsset;
  fit?: 'cover' | 'contain';
  sizes?: string;
  priority?: boolean;
};

/**
 * Fills a photo position, in order of preference:
 *   1. the Cloudinary asset an admin uploaded for this slot,
 *   2. a file committed to `public/images/` and registered in `images.ts`,
 *   3. an art-directed placeholder carrying the brief for that frame.
 */
export function Photo({
  slot,
  alt,
  asset,
  fit = 'cover',
  sizes = '(max-width: 900px) 100vw, 40vw',
  priority = false,
}: PhotoProps) {
  const className = fit === 'contain' ? styles.imgContain : styles.imgCover;
  const label = asset?.alt?.trim() || alt;

  if (asset && isCloudinaryConfigured()) {
    return (
      <Image
        loader={cloudinaryLoader}
        src={asset.publicId}
        alt={label}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurUrl(asset.publicId)}
        className={className}
      />
    );
  }

  const bundled = getImage(slot);

  if (bundled) {
    return (
      <Image
        src={bundled}
        alt={label}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className={className}
      />
    );
  }

  return (
    <div className={styles.placeholder} role="img" aria-label={alt}>
      <span aria-hidden="true" className={styles.placeholderMark}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2.5c1.9 3.9 5.6 5.8 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-3.8 3.7-5.7 5.6-9.6Z" />
          <path d="M12 8.4V21" />
        </svg>
      </span>
      <span aria-hidden="true" className={styles.placeholderText}>
        {alt}
      </span>
    </div>
  );
}
