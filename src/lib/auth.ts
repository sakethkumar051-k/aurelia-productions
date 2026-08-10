import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { adminAuth } from '@/lib/firebase/admin';

export const SESSION_COOKIE = 'aurevia_admin';
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export type AdminUser = {
  uid: string;
  email: string;
};

/**
 * Accounts allowed into the admin panel.
 *
 * Firebase Auth proves *who* someone is; this list decides who may edit. It is
 * deliberately fail-closed: with `ADMIN_EMAILS` unset nobody gets in, so a
 * misconfigured deploy locks the panel rather than opening it.
 */
function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowed(email: string | undefined): boolean {
  if (!email) return false;
  return allowlist().includes(email.toLowerCase());
}

/** Verifies the session cookie. Returns null rather than throwing. */
export async function currentAdmin(): Promise<AdminUser | null> {
  // Read the cookie first, unconditionally. Besides being what we need, it
  // marks every admin route as runtime-rendered — short-circuiting above this
  // line would let Next prerender an admin page (and cache its logged-out
  // redirect) at build time.
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;

  const auth = adminAuth();
  if (!auth || !cookie) return null;

  try {
    // `true` also checks the token against revoked sessions.
    const claims = await auth.verifySessionCookie(cookie, true);
    if (!isAllowed(claims.email)) return null;
    return { uid: claims.uid, email: claims.email ?? '' };
  } catch {
    return null;
  }
}

/** Guards a server component or action; redirects to the login screen. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}
