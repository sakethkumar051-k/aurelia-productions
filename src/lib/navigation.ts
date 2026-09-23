import type { Content } from '@/content/schema';

/** Keep destinations fixed while editors can change the visible labels. */
export function siteNavigation(header: Content['header']) {
  return [
    { href: '/', label: header.links.home },
    { href: '/about', label: header.links.about },
    { href: '/services', label: header.links.services },
    { href: '/festive-decor', label: header.links.festive },
    { href: '/portfolio', label: header.links.portfolio },
    { href: '/contact', label: header.links.contact },
  ];
}
