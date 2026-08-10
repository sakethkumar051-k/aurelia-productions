import type { MetadataRoute } from 'next';

import { getContent } from '@/lib/content';
import { siteUrl } from '@/lib/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services } = await getContent();
  const base = siteUrl();
  const lastModified = new Date();

  const pages = [
    { path: '/', priority: 1 },
    { path: '/about', priority: 0.7 },
    { path: '/services', priority: 0.9 },
    { path: '/festive-decor', priority: 0.8 },
    { path: '/portfolio', priority: 0.8 },
    { path: '/contact', priority: 0.9 },
  ];

  return [
    ...pages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
