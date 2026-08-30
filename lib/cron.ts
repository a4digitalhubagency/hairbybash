/**
 * Shared guard for the scheduled-job endpoints.
 *
 * These are ordinary public HTTPS routes — GitHub Actions reaches them the same
 * way anyone else can. Without a shared secret, anyone who guessed the path
 * could fire reminder emails at every client on the books, so the secret is
 * required rather than optional: a missing CRON_SECRET fails closed.
 */
import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/**
 * Returns a 401/500 response when the request is not an authorised cron call,
 * or null when it may proceed.
 */
export function rejectUnauthorisedCron(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET

  if (!secret) {
    console.error('[cron] CRON_SECRET is not set — refusing to run')
    return NextResponse.json({ error: 'Scheduled jobs are not configured' }, { status: 500 })
  }

  const header = req.headers.get('authorization') ?? ''
  const provided = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!provided || !safeEqual(provided, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
