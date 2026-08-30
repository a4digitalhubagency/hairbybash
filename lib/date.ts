/**
 * Calgary-anchored date helpers.
 *
 * Every `booking_date`, `start_time` and `end_time` in this app is Calgary
 * wall-clock with no timezone attached. Vercel runs the server in UTC, so a
 * bare `new Date()` sits in a different frame from the data — which is how
 * same-day morning slots became invisible to clients (the server read 09:00
 * Calgary as 15:00 and filtered them out) and how "today" rolled over to
 * tomorrow at 18:00 local.
 *
 * Use these anywhere a calendar day or a wall-clock time is involved. Reach for
 * a bare Date only for true instants — `created_at`, elapsed time, Stripe
 * timestamps.
 */

/** Calgary, AB. Named for the tz database zone, which has no "Calgary" entry. */
export const STUDIO_TIME_ZONE = 'America/Edmonton'

const wallClock = new Intl.DateTimeFormat('en-US', {
  timeZone: STUDIO_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  // hourCycle rather than hour12:false — the latter yields "24" for midnight
  // on some ICU builds, which would make studioMinutes() return 1440.
  hourCycle: 'h23',
})

interface WallClockParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

function partsOf(instant: Date): WallClockParts {
  const raw: Record<string, string> = {}
  for (const part of wallClock.formatToParts(instant)) {
    if (part.type !== 'literal') raw[part.type] = part.value
  }
  return {
    year: Number(raw.year),
    month: Number(raw.month),
    day: Number(raw.day),
    hour: Number(raw.hour),
    minute: Number(raw.minute),
  }
}

/** Formats a Date's *local* fields as YYYY-MM-DD. Pair with `studioNow()`. */
export function toDateString(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

/** The calendar date in Calgary as YYYY-MM-DD — the format `booking_date` uses. */
export function studioDate(instant: Date = new Date()): string {
  const { year, month, day } = partsOf(instant)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Minutes since midnight in Calgary — the unit the slot loop already works in. */
export function studioMinutes(instant: Date = new Date()): number {
  const { hour, minute } = partsOf(instant)
  return hour * 60 + minute
}

/**
 * A Date whose *local* fields — `getFullYear`, `getMonth`, `getDate`,
 * `getHours` — read as Calgary wall-clock.
 *
 * For components that already do local-field arithmetic, passing this instead
 * of `new Date()` makes them timezone-correct with no other change.
 *
 * This is not an instant. Never compare it against a real timestamp, and never
 * use it for duration maths — its epoch value is deliberately wrong. Wall-clock
 * field access only.
 */
export function studioNow(): Date {
  const { year, month, day, hour, minute } = partsOf(new Date())
  return new Date(year, month - 1, day, hour, minute)
}
