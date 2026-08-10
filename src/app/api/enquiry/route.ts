import { NextResponse } from 'next/server';

import { firestore } from '@/lib/firebase/admin';

type EnquiryPayload = {
  name?: unknown;
  phone?: unknown;
  type?: unknown;
  date?: unknown;
  city?: unknown;
  budget?: unknown;
  message?: unknown;
  /** Honeypot — real people never see this field, bots fill it in. */
  company?: unknown;
};

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Best-effort throttle for a single server instance. Replace with a shared
 * store (Firestore, Upstash) if the site is ever deployed to more than one
 * region — this map resets on every cold start.
 */
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let body: EnquiryPayload;

  try {
    body = (await request.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Malformed request.' },
      { status: 400 },
    );
  }

  // Silently accept honeypot submissions so bots learn nothing.
  if (text(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Too many enquiries from this connection. Please WhatsApp us instead.',
      },
      { status: 429 },
    );
  }

  const enquiry = {
    name: text(body.name, 120),
    phone: text(body.phone, 40),
    type: text(body.type, 80),
    date: text(body.date, 20),
    city: text(body.city, 80),
    budget: text(body.budget, 40),
    message: text(body.message, 4000),
    receivedAt: new Date().toISOString(),
  };

  const errors: Record<string, string> = {};
  if (!enquiry.name) errors.name = 'Please tell us your name.';
  if (!/^[\d+\-\s()]{7,20}$/.test(enquiry.phone)) {
    errors.phone = 'Please give a phone or WhatsApp number we can reach.';
  }
  if (!enquiry.type) errors.type = 'Please choose an event type.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Archive first — the admin inbox is the record of every enquiry, and it must
  // survive an email provider being down.
  const db = firestore();
  let stored = false;

  if (db) {
    try {
      await db.collection('enquiries').add(enquiry);
      stored = true;
    } catch (error) {
      console.error('[enquiry] Firestore write failed:', error);
    }
  }

  // TODO(email): deliver to the studio inbox once the provider is chosen.
  // Everything is recorded above, so a delivery failure never loses an enquiry.
  if (!stored) {
    console.info('[enquiry]', JSON.stringify(enquiry));
  }

  return NextResponse.json({ ok: true });
}
