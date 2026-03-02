import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import { getActiveServices } from '@/lib/services'
import BookingFlow from '@/components/booking/BookingFlow'

// Booking page must always be fresh — real-time availability
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book an Appointment | HairbyBash',
  description:
    'Reserve your luxury braiding or loc maintenance appointment with HairbyBash in Calgary, AB.',
}

interface Props {
  searchParams: Promise<{ service?: string }>
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams
  const services = await getActiveServices()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark pt-20 pb-24">
        <BookingFlow
          services={services}
          preSelectedServiceId={params.service ?? null}
        />
      </main>
    </>
  )
}
