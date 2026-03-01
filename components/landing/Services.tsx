import Link from 'next/link'
import { getActiveServices } from '@/lib/services'
import ServicesCarousel from './ServicesCarousel'

export default async function Services() {
  const services = await getActiveServices()

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
