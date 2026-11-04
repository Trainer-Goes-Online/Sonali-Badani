import { NextResponse, type NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

/**
 * Checks the key that unlocks time travel on /live (`?preview=10&secret=...`).
 *
 * The key lives in PREVIEW_SECRET, deliberately WITHOUT the NEXT_PUBLIC_
 * prefix: anything public is inlined into the page's JavaScript, where anyone
 * could read it. Here it never leaves the server; the page only learns yes or
 * no. With no PREVIEW_SECRET set, preview is off everywhere.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const expected = (process.env.PREVIEW_SECRET ?? '').trim();

  let given = '';
  try {
    const body = (await req.json()) as { secret?: unknown };
    given = typeof body.secret === 'string' ? body.secret.slice(0, 200) : '';
  } catch {
    given = '';
  }

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  const ok = expected.length > 0 && a.length === b.length && timingSafeEqual(a, b);

  return NextResponse.json({ ok }, { headers: { 'Cache-Control': 'no-store' } });
}
