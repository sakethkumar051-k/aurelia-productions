import type { StaticImageData } from 'next/image';

import aboutStory from '../../public/images/about-story.webp';

/**
 * Photography register.
 *
 * Every photo position in the design is addressed by a stable `slot` id. Drop a
 * file into `public/images/`, import it here and map it to its slot — the `Photo`
 * component picks it up everywhere that slot appears. Slots with no entry render
 * the art-direction placeholder instead, so the site stays presentable while the
 * client's shoot is still in progress.
 *
 * Admin-uploaded Cloudinary photos take precedence over these bundled images.
 * Removing an upload restores the image registered here for that slot.
 *
 * Slot ids in use
 *   cat-<service-slug>        five pillar cards on the home page
 *   feat-1 … feat-3           featured work on the home page
 *   about-story               about page story image
 *   team-1 … team-4           team portraits
 *   svc-hero-<slug>           service detail hero
 *   svc-<slug>-0 … -3         service detail gallery
 *   ganesh-normal | -premium  festive tier cards
 *   pf-<slugified-title>      portfolio tiles and lightbox
 */
export const IMAGES: Record<string, StaticImageData> = {
  'about-story': aboutStory,
};

export function getImage(slot: string): StaticImageData | undefined {
  return IMAGES[slot];
}
