import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/lib/auth';

/**
 * Optimistic guard for the admin panel.
 *
 * This runs at the edge, where the Firebase Admin SDK is unavailable, so it
 * only checks that a session cookie is *present* — enough to bounce anonymous
 * visitors straight to the login screen. The cookie is actually verified in
 * `requireAdmin()`, which every admin page and action calls.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (hasSession) return NextResponse.next();

  const login = new URL('/admin/login', request.url);
  if (pathname !== '/admin') login.searchParams.set('next', pathname);

  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
