import { createAdminClient } from '@/lib/supabase/admin'
import type { Booking } from '@/types'

export async function getBookingBySessionId(
  sessionId: string,
): Promise<Booking | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*, service:services(*)')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) return null
  return data as Booking
}
