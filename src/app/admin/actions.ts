'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';

import { defaultContent } from '@/content/defaults';
import {
  CONTENT_SECTIONS,
  type ContentSection,
  contentSchema,
  mediaAssetSchema,
} from '@/content/schema';
import { requireAdmin } from '@/lib/auth';
import { CONTENT_COLLECTION, CONTENT_TAG, getContentFresh } from '@/lib/content';
import { firestore } from '@/lib/firebase/admin';
import { mediaSlots } from '@/lib/media-slots';
import { signUploadParams } from '@/lib/cloudinary-server';

export type ActionResult = { ok: true } | { ok: false; error: string };

function isSection(value: string): value is ContentSection {
  return (CONTENT_SECTIONS as readonly string[]).includes(value);
}

/**
 * Sections whose value is a bare array. Firestore documents must have named
 * fields at the root, so these are wrapped in `{ items: [...] }` on the way in
 * and unwrapped on the way out (see `readOverrides`).
 */
const ARRAY_SECTIONS: ContentSection[] = ['services'];

/**
 * Saves one section of the content tree.
 *
 * The payload is validated against that section's slice of the schema before it
 * touches Firestore, so the live site can never be handed a shape it cannot
 * render. On success the content tag is expired, making the change visible on
 * the next request rather than after a stale window.
 */
export async function saveSection(
  section: string,
  value: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  if (!isSection(section)) {
    return { ok: false, error: `Unknown section "${section}".` };
  }

  const parsed = contentSchema.shape[section].safeParse(value);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const where = first?.path.join(' → ') || 'this section';
    return { ok: false, error: `${where}: ${first?.message ?? 'invalid value'}` };
  }

  if (section === 'portfolio') {
    const slots = (parsed.data as { items: { slot: string }[] }).items.map(
      (item) => item.slot,
    );
    if (slots.some((slot) => !slot.trim()) || new Set(slots).size !== slots.length) {
      return {
        ok: false,
        error: 'Every portfolio photo needs a unique image key.',
      };
    }
  }

  const db = firestore();
  if (!db) {
    return { ok: false, error: 'Firebase is not configured on the server.' };
  }

  try {
    const payload = ARRAY_SECTIONS.includes(section)
      ? { items: parsed.data }
      : (parsed.data as Record<string, unknown>);

    await db
      .collection(CONTENT_COLLECTION)
      .doc(section)
      .set({ ...payload, _updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[admin] save failed:', error);
    return { ok: false, error: 'Could not write to Firestore. Please retry.' };
  }

  updateTag(CONTENT_TAG);
  revalidatePath('/admin', 'layout');

  return { ok: true };
}

/** Drops the stored override so the section falls back to the shipped copy. */
export async function resetSection(section: string): Promise<ActionResult> {
  await requireAdmin();

  if (!isSection(section)) {
    return { ok: false, error: `Unknown section "${section}".` };
  }

  const db = firestore();
  if (!db) {
    return { ok: false, error: 'Firebase is not configured on the server.' };
  }

  try {
    await db.collection(CONTENT_COLLECTION).doc(section).delete();
  } catch (error) {
    console.error('[admin] reset failed:', error);
    return { ok: false, error: 'Could not write to Firestore. Please retry.' };
  }

  updateTag(CONTENT_TAG);
  revalidatePath('/admin', 'layout');

  return { ok: true };
}

/** Returns the default value for a section, for the editor's "restore". */
export async function sectionDefault(section: string): Promise<unknown> {
  await requireAdmin();
  if (!isSection(section)) return null;
  return defaultContent[section];
}

/* Media ------------------------------------------------------------------ */

export async function saveMediaAsset(
  slot: string,
  asset: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = mediaAssetSchema.safeParse(asset);
  if (!parsed.success) {
    return { ok: false, error: 'That upload came back in an unexpected shape.' };
  }

  if (!mediaSlots(await getContentFresh()).some((item) => item.slot === slot)) {
    return {
      ok: false,
      error: 'That photo position is no longer on the site. Refresh this page.',
    };
  }

  const db = firestore();
  if (!db) {
    return { ok: false, error: 'Firebase is not configured on the server.' };
  }

  try {
    await db
      .collection(CONTENT_COLLECTION)
      .doc('media')
      .set(
        { [slot]: { ...parsed.data, updatedAt: new Date().toISOString() } },
        { merge: true },
      );
  } catch (error) {
    console.error('[admin] media save failed:', error);
    return { ok: false, error: 'Could not save that image. Please retry.' };
  }

  updateTag(CONTENT_TAG);
  revalidatePath('/admin', 'layout');

  return { ok: true };
}

export async function removeMediaAsset(slot: string): Promise<ActionResult> {
  await requireAdmin();

  if (!mediaSlots(await getContentFresh()).some((item) => item.slot === slot)) {
    return {
      ok: false,
      error: 'That photo position is no longer on the site. Refresh this page.',
    };
  }

  const db = firestore();
  if (!db) {
    return { ok: false, error: 'Firebase is not configured on the server.' };
  }

  try {
    await db
      .collection(CONTENT_COLLECTION)
      .doc('media')
      .update(new FieldPath(slot), FieldValue.delete());
  } catch (error) {
    console.error('[admin] media removal failed:', error);
    return { ok: false, error: 'Could not remove that image. Please retry.' };
  }

  updateTag(CONTENT_TAG);
  revalidatePath('/admin', 'layout');

  return { ok: true };
}

/**
 * Signs a direct browser → Cloudinary upload.
 *
 * The API secret stays on the server; the browser gets a short-lived signature
 * for one upload, so image bytes never pass through this app.
 */
export async function createUploadSignature(folder: string) {
  await requireAdmin();
  return signUploadParams(folder);
}
