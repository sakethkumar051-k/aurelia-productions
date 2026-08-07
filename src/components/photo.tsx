import Image from 'next/image';

import { getImage } from '@/content/images';

import styles from './photo.module.css';

type PhotoProps = {
  /** Stable slot id from the design handoff — see `src/content/images.ts`. */
  slot: string;
  /** Art-direction brief; doubles as the alt text until the real shot lands. */
  alt: string;
  fit?: 'cover' | 'contain';
  sizes?: string;
  priority?: boolean;
};

/**
 * Fills a photo position. Renders the registered photograph when one exists,
 * otherwise an art-directed placeholder carrying the brief for that frame.
 */
export function Photo({
  slot,
  alt,
  fit = 'cover',
  sizes = '(max-width: 900px) 100vw, 40vw',
  priority = false,
}: PhotoProps) {
  const src = getImage(slot);

  if (!src) {
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

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={fit === 'contain' ? styles.imgContain : styles.imgCover}
    />
  );
}
