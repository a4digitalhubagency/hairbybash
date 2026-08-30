/**
 * Fixed-window rate limiting for public endpoints.
 *
 * The counter lives in Postgres because the app runs serverless: instances do
 * not share memory, so an in-memory limiter resets on every cold start — a
 * limit that looks like protection without being any.
 *
 * Fixed windows, not sliding: a caller can in principle land 2× the limit
 * across a window boundary. That is a known and acceptable looseness here — the
 * job is to stop a script holding the whole calendar, not to meter an API.
 */
import { createAdminClient } from '@/lib/supabase/admin'

export interface RateLimitResult {
  allowed: boolean
  /** Seconds until the current window rolls over. For Retry-After. */
  retryAfter: number
}

/**
 * Best-effort caller identity.
 *
 * Vercel sets x-forwarded-for; the leftmost entry is the client, the rest are
 * proxies. It is spoofable in principle, which is why this guards volume rather
 * than anything that must not be bypassed.
 */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  return ip
}

/**
 * Records one hit and reports whether the caller is within their allowance.
 *
 * Fails open. If the counter is unreachable the request proceeds: a booking
 * form that stops working because a limiter had a bad moment is worse than the
 * abuse it prevents.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs)
  const retryAfter = Math.ceil((windowStart.getTime() + windowMs - now) / 1000)

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.rpc('bump_rate_limit', {
      p_bucket: key,
      p_window_start: windowStart.toISOString(),
    })

    if (error) {
      console.error('[rate-limit] Counter unavailable, allowing request:', error.message)
      return { allowed: true, retryAfter: 0 }
    }

    return { allowed: (data as number) <= limit, retryAfter }
  } catch (err) {
    console.error('[rate-limit] Counter threw, allowing request:', err)
    return { allowed: true, retryAfter: 0 }
  }
}

/** 429 with Retry-After, for a caller over their allowance. */
export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    },
  )
}
