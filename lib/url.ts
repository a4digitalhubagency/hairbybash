/**
 * Returns the canonical app URL for use in server-side redirects and
 * Stripe checkout success/cancel URLs.
 *
 * Priority:
 *  1. NEXT_PUBLIC_APP_URL  — set manually in Vercel project settings
 *  2. VERCEL_URL           — injected automatically by Vercel per-deployment
 *  3. http://localhost:3000 — local dev fallback
 *
 * Always set NEXT_PUBLIC_APP_URL in Vercel to your production domain
 * (e.g. https://hairbybash.ca) so Stripe redirects to the right place.
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
