export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`
}

export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatDate(dateStr: string): string {
  // "2026-03-10" → "Tuesday, March 10, 2026"
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  // "2026-03-10" → "Tue, Mar 10"
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(timeStr: string): string {
  // "09:00" or "09:00:00" → "9:00 AM"
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 || 12
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
}

/**
 * Stripe will not accept a CAD charge below 50 cents. A service whose deposit
 * computes to less than this cannot be booked online at all — checkout rejects
 * it, so the admin form warns before it can be saved.
 */
export const STRIPE_MIN_CHARGE_CENTS = 50

/**
 * Whether a client can actually complete checkout for this service.
 *
 * A service whose deposit falls below Stripe's minimum is rejected at the
 * payment step, so it must never set a category's "from" price — advertising
 * a price nobody can pay is worse than not advertising one.
 */
export function isBookableOnline(service: { price: number; deposit_percentage: number }): boolean {
  return calculateDeposit(service.price, service.deposit_percentage).depositTotal >= STRIPE_MIN_CHARGE_CENTS
}

export function calculateDeposit(
  priceInCents: number,
  depositPercentage: number,
): {
  servicePrice: number
  depositBase: number
  depositGST: number
  depositTotal: number
  remainder: number
} {
  const depositBase = Math.round(priceInCents * depositPercentage / 100)
  const depositGST = Math.round(depositBase * 0.05)
  const depositTotal = depositBase + depositGST
  const remainder = priceInCents - depositBase
  return { servicePrice: priceInCents, depositBase, depositGST, depositTotal, remainder }
}
