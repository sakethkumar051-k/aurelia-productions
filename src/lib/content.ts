import 'server-only';

import { cacheTag } from 'next/cache';

import { defaultContent } from '@/content/defaults';
import {
  type Content,
  type ContentSection,
  CONTENT_SECTIONS,
  contentSchema,
} from '@/content/schema';
import { firestore } from '@/lib/firebase/admin';

export const CONTENT_TAG = 'content';
export const CONTENT_COLLECTION = 'content';

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== null
  );
}

/**
 * Overlays a partial override onto a base value.
 *
 * Objects merge key by key; arrays and primitives replace outright. Replacing
 * arrays is deliberate — element-wise merging would make deleting the last item
 * in a list impossible.
 */
export function mergeDeep<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T;

  const result: Plain = { ...base };

  for (const [key, value] of Object.entries(override)) {
    result[key] = key in base ? mergeDeep(base[key], value) : value;
  }

  return result as T;
}

async function readOverrides(): Promise<Partial<Record<ContentSection, unknown>>> {
  const db = firestore();
  if (!db) return {};

  try {
    const snapshot = await db.collection(CONTENT_COLLECTION).get();
    const overrides: Partial<Record<ContentSection, unknown>> = {};

    for (const doc of snapshot.docs) {
      const section = doc.id as ContentSection;
      if (!CONTENT_SECTIONS.includes(section)) continue;

      const data = doc.data();
      // Lists are stored under `items` because Firestore documents cannot hold
      // a bare array at the root.
      overrides[section] =
        section === 'services' ? (data.items ?? []) : data;
    }

    return overrides;
  } catch (error) {
    console.error('[content] Firestore read failed, using defaults:', error);
    return {};
  }
}

async function buildContent(): Promise<Content> {
  const overrides = await readOverrides();

  const merged = CONTENT_SECTIONS.reduce<Content>((accumulator, section) => {
    if (!(section in overrides)) return accumulator;
    return {
      ...accumulator,
      [section]: mergeDeep(accumulator[section], overrides[section]),
    };
  }, defaultContent);

  const parsed = contentSchema.safeParse(merged);

  if (!parsed.success) {
    console.error(
      '[content] Stored content failed validation, using defaults:',
      parsed.error.issues.slice(0, 5),
    );
    return defaultContent;
  }

  return parsed.data;
}

/**
 * The whole content tree, cached until an admin save calls `updateTag`.
 *
 * Marketing pages await this at build time and serve static HTML; a save
 * expires the tag so the very next request renders the new copy.
 */
export async function getContent(): Promise<Content> {
  'use cache';
  cacheTag(CONTENT_TAG);
  return buildContent();
}

/** Uncached read — for the admin panel, which must never show stale values. */
export async function getContentFresh(): Promise<Content> {
  return buildContent();
}

export function getService(content: Content, slug: string) {
  return content.services.find((service) => service.slug === slug);
}

export function otherServices(content: Content, slug: string) {
  return content.services.filter((service) => service.slug !== slug);
}

/** Portfolio filters, derived from the categories actually in use. */
export function portfolioFilters(content: Content): string[] {
  const seen: string[] = [];
  for (const item of content.portfolio.items) {
    if (!seen.includes(item.cat)) seen.push(item.cat);
  }
  return ['All', ...seen];
}
