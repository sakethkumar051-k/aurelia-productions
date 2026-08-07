import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
 * store (Redis, Upstash, the admin database) once the backend is chosen —
 * this map resets on every cold start and is not shared between regions.
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
      { ok: false, error: 'Too many enquiries from this connection. Please WhatsApp us instead.' },
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

  // TODO(backend): deliver the enquiry once the admin stack is chosen —
  // transactional email to SITE.email, a row in the admin database, and a
  // WhatsApp/CRM notification. Until then it is recorded in the server log so
  // nothing submitted during preview is lost.
  console.info('[enquiry]', JSON.stringify(enquiry));

  return NextResponse.json({ ok: true });
}
