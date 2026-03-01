export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface Service {
  id: string
  name: string
  description: string
  price: number // in cents
  deposit_percentage: number
  duration_minutes: number
  category: string
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
