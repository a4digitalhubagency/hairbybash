export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

/**
 * A top-level grouping in the service menu — Braids, Twists, Locs and so on.
 * Categories are navigation only: they are never bookable and carry no price.
 * The client picks a category, then one of its services, then a date.
 */
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  active: boolean
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number // in cents
  deposit_percentage: number
  duration_minutes: number
  /** @deprecated Legacy flat category name. Use category_id; kept only until the last reader is migrated. */
  category: string
  category_id: string | null
  image_url: string | null
  active: boolean
  created_at: string
}

export interface Booking {
  id: string
  service_id: string
  client_name: string
  client_email: string
  client_phone: string
  booking_date: string // ISO date string YYYY-MM-DD
  start_time: string   // HH:MM:SS
  end_time: string     // HH:MM:SS
  status: BookingStatus
  payment_status: PaymentStatus
  stripe_session_id: string | null
  /** Client indicated hair will be detangled & blow dried before appointment. Charged in person. */
  blow_dry_requested: boolean
  /** Whether the client has used their one-time reschedule (must be >48h before appointment). */
  reschedule_used: boolean
  created_at: string
  // joined
  service?: Service
}

export interface WeeklyAvailability {
  id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  start_time: string  // HH:MM:SS
  end_time: string    // HH:MM:SS
}

export interface BlockedDate {
  id: string
  date: string  // YYYY-MM-DD
  reason: string | null
}

export interface TimeSlot {
  start: string // HH:MM
  end: string   // HH:MM
  available: boolean
}
