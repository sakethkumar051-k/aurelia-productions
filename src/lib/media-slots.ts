import type { Content } from '@/content/schema';
import { portfolioSlot } from '@/content/portfolio';

export type MediaSlot = {
  slot: string;
  label: string;
  group: string;
  /** The art-direction brief — what this frame is meant to show. */
  brief: string;
};

/**
 * Every photo position on the site, derived from the content tree.
 *
 * Because it is derived, adding a service or a portfolio item in the admin
 * panel immediately adds its photo slots here — the media page never goes
 * stale against the content.
 */
export function mediaSlots(content: Content): MediaSlot[] {
  const slots: MediaSlot[] = [
    {
      slot: 'about-story',
      label: 'About — story image',
      group: 'About',
      brief: content.about.story.imageAlt,
    },
  ];

  for (const item of content.home.featured.items) {
    slots.push({
      slot: item.slot,
      label: `Featured — ${item.title}`,
      group: 'Home',
      brief: item.alt,
    });
  }

  for (const member of content.about.team.members) {
    slots.push({
      slot: member.slot,
      label: `Team — ${member.name}`,
      group: 'About',
      brief: member.alt,
    });
  }

  for (const service of content.services) {
    slots.push({
      slot: `cat-${service.slug}`,
      label: `${service.short} — card image`,
      group: service.title,
      brief: service.hero,
    });
    slots.push({
      slot: `svc-hero-${service.slug}`,
      label: `${service.short} — page hero`,
      group: service.title,
      brief: service.hero,
    });

    service.gallery.forEach((caption, index) => {
      slots.push({
        slot: `svc-${service.slug}-${index}`,
        label: `${service.short} — gallery ${index + 1}`,
        group: service.title,
        brief: caption,
      });
    });
  }

  for (const tier of content.festive.compare.tiers) {
    slots.push({
      slot: tier.slot,
      label: `Festive — ${tier.tier}`,
      group: 'Festive Decor',
      brief: tier.alt,
    });
  }

  for (const item of content.portfolio.items) {
    slots.push({
      slot: item.slot || portfolioSlot(item.title),
      label: `Portfolio — ${item.title}`,
      group: 'Portfolio',
      brief: item.alt,
    });
  }

  return slots;
}

export function groupSlots(slots: MediaSlot[]): [string, MediaSlot[]][] {
  const groups = new Map<string, MediaSlot[]>();

  for (const slot of slots) {
    const bucket = groups.get(slot.group);
    if (bucket) bucket.push(slot);
    else groups.set(slot.group, [slot]);
  }

  return Array.from(groups.entries());
}
