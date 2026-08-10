'use client';

import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId);
}

let app: FirebaseApp | undefined;

/**
 * Browser-side Firebase, used only to sign the admin in. The resulting ID token
 * is exchanged for an httpOnly session cookie, so no Firebase state is trusted
 * by the server beyond that one verified exchange.
 */
export function clientAuth(): Auth | null {
  if (!isFirebaseClientConfigured()) return null;

  if (!app) {
    app = getApps()[0] ?? initializeApp(config);
  }

  return getAuth(app);
}
