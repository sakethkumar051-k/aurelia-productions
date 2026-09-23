import 'server-only';

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const APP_NAME = 'aurevia-admin';
let invalidConfig = false;

/**
 * Firebase Admin, initialised lazily from environment variables.
 *
 * Every accessor returns `null` when the service account is not configured, so
 * the marketing site still builds and renders from its bundled default content
 * on a machine with no Firebase credentials (a fresh clone, CI, a preview).
 * Callers must handle `null` — that is the "content not wired up yet" path.
 */
function credentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys are pasted into env files with escaped newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) return null;

  return { projectId, clientEmail, privateKey };
}

export function isFirebaseConfigured(): boolean {
  return app() !== null;
}

function app() {
  if (invalidConfig) return null;
  const config = credentials();
  if (!config) return null;

  const existing = getApps().find((instance) => instance.name === APP_NAME);
  if (existing) return existing;

  try {
    return initializeApp({ credential: cert(config) }, APP_NAME);
  } catch (error) {
    // A malformed production key must not take down the login page (or the
    // public site). A genuinely concurrent init can still be reused.
    const concurrent = getApps().find((instance) => instance.name === APP_NAME);
    if (concurrent) return concurrent;
    invalidConfig = true;
    console.error('[firebase] Admin credentials are invalid:', error);
    return null;
  }
}

export function firestore() {
  const instance = app();
  return instance ? getFirestore(instance) : null;
}

export function adminAuth() {
  const instance = app();
  return instance ? getAuth(instance) : null;
}
