import Link from 'next/link'
import { getActiveServices } from '@/lib/services'
import ServicesCarousel from './ServicesCarousel'

export default async function Services() {
  let services: Awaited<ReturnType<typeof getActiveServices>> = []

  try {
    services = await getActiveServices()
  } catch (err) {
    // Don't crash the entire landing page over one section.
    // Log server-side, render a graceful inline fallback.
    console.error('[Services section] Failed to load:', err)
    return (
      <section className="bg-dark py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-(family-name:--font-playfair) font-bold text-4xl text-white mb-2">
                Our Services
              </h2>
              <p className="text-white/50 text-sm">Curated styles for the modern individual.</p>
            </div>
          </div>
          <div className="py-16 text-center rounded-2xl border border-white/5">
            <p className="text-white/30 text-sm">
              Services are temporarily unavailable. Please try again shortly.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-dark py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-(family-name:--font-playfair) font-bold text-4xl text-white mb-2">
              Our Services
            </h2>
            <p className="text-white/50 text-sm">Curated styles for the modern individual.</p>
          </div>
          <Link href="/services" className="text-gold text-sm hover:underline hidden md:inline">
            View Full Menu →
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/40 text-base">Services coming soon — check back shortly.</p>
          </div>
        ) : (
          <ServicesCarousel services={services} />
        )}

        {/* Mobile link */}
        {services.length > 0 && (
          <div className="mt-6 text-center md:hidden">
            <Link href="/services" className="text-gold text-sm hover:underline">
              View Full Menu →
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}
