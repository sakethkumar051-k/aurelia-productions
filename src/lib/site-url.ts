const FALLBACK = 'https://aurelia-productions.vercel.app';

/**
 * Absolute origin for canonical URLs, Open Graph and the sitemap.
 * Set `NEXT_PUBLIC_SITE_URL` per environment; Vercel previews fall back to
 * their generated hostname so preview links stay self-consistent.
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');

  if (process.env.VERCEL_ENV === 'production') return FALLBACK;

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return FALLBACK;
}
