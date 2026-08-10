import { NextResponse } from 'next/server';

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  isAllowed,
} from '@/lib/auth';
import { adminAuth } from '@/lib/firebase/admin';

/**
 * Exchanges a Firebase ID token for an httpOnly session cookie.
 *
 * The browser's Firebase credentials never leave the login screen — everything
 * after this point is a server-verified cookie, so no admin state depends on
 * client-side JavaScript being honest.
 */
export async function POST(request: Request) {
  const auth = adminAuth();

  if (!auth) {
    return NextResponse.json(
      { ok: false, error: 'Firebase is not configured on the server.' },
      { status: 503 },
    );
  }

  let idToken: string;

  try {
    const body = (await request.json()) as { idToken?: unknown };
    if (typeof body.idToken !== 'string' || !body.idToken) {
      throw new Error('missing token');
    }
    idToken = body.idToken;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Malformed request.' },
      { status: 400 },
    );
  }

  try {
    const decoded = await auth.verifyIdToken(idToken, true);

    if (!isAllowed(decoded.email)) {
      return NextResponse.json(
        { ok: false, error: 'This account is not permitted to edit the site.' },
        { status: 403 },
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error('[admin] session exchange failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Could not verify that sign-in. Please try again.' },
      { status: 401 },
    );
  }
}

/** Sign out — clears the cookie and revokes the refresh token. */
export async function DELETE() {
  const auth = adminAuth();
  const response = NextResponse.json({ ok: true });

  if (auth) {
    try {
      const { currentAdmin } = await import('@/lib/auth');
      const admin = await currentAdmin();
      if (admin) await auth.revokeRefreshTokens(admin.uid);
    } catch {
      // Signing out locally matters more than revoking cleanly.
    }
  }

  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
