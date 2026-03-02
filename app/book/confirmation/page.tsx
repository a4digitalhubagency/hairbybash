import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import ConfirmationCard from '@/components/booking/ConfirmationCard'
import { getBookingBySessionId } from '@/lib/bookings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Booking Confirmed | HairbyBash',
  description: 'Your appointment with HairbyBash has been confirmed.',
}

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) redirect('/book')

  // Fetch the booking — if not found yet (webhook delay), pass null and let
  // the client component poll until it appears or we hit max retries
  let booking = null
  try {
    booking = await getBookingBySessionId(sessionId)
  } catch (err) {
    console.error('[confirmation] Failed to fetch booking:', err)
    // Don't throw — ConfirmationCard handles the null case gracefully
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark pt-20 pb-16 px-6">
        <ConfirmationCard booking={booking} sessionId={sessionId} />
      </main>
    </>
  )
}
