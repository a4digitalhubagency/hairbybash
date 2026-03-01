import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import ServicesGrid from '@/components/services/ServicesGrid'
import { getActiveServices } from '@/lib/services'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Services | HairbyBash',
  description:
    'Browse our full menu of premium braiding, loc maintenance, and protective styling services in Calgary, AB.',
}

export default async function ServicesPage() {
  const services = await getActiveServices()

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="relative bg-dark-surface pt-36 pb-20 px-6 text-center overflow-hidden">
          {/* Subtle gradient bottom-fade into the grid section */}
          <div className="absolute inset-0 bg-linear-to-b from-dark-surface via-dark-surface to-dark pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
              Premium Care
            </p>
            <h1 className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white leading-tight mb-5">
              Our Services Menu
            </h1>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Discover our range of premium braiding, styling, and treatment services
              tailored to enhance your unique beauty in a luxurious setting.
            </p>
          </div>
        </section>

        {/* ── Grid (client — handles filter + animations) ── */}
        <ServicesGrid services={services} />

        {/* ── Bottom CTA ── */}
        <section className="bg-dark py-20 px-6 text-center border-t border-white/5">
          <div className="max-w-md mx-auto">
            <span className="text-gold text-xl">♦</span>
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-white mt-4 mb-3 leading-snug">
              Not sure what you need?
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              Book a free 15-minute consultation. We&apos;ll assess your hair health and
              discuss the perfect style for your lifestyle.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/book"
                className="px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
              >
                Book Consultation
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 border border-white/30 text-white text-sm rounded hover:border-white/70 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
