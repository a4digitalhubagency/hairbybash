'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Service } from '@/types'

const CATEGORIES = ['All Services', 'Braids', 'Locs', 'Twists', 'Cornrows', 'Kids']

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [activeCategory, setActiveCategory] = useState('All Services')

  // Always show all categories — Kids shows a coming-soon state when empty
  const availableCategories = CATEGORIES

  const filtered =
    activeCategory === 'All Services'
      ? services
      : services.filter((s) => s.category === activeCategory)

  return (
    <section className="bg-dark pb-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Category filter ── */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto scrollbar-hide py-1 md:justify-center">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative shrink-0 px-5 py-2 rounded-full text-sm font-medium outline-none"
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="services-pill"
                  className="absolute inset-0 bg-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'text-black'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* ── Service card grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="bg-dark-card rounded-2xl overflow-hidden border border-white/5 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <Image
                    src={service.image_url ?? '/images/services/MediumKnotlessBraids.webp'}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  {/* Duration badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/65 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                      {formatDuration(service.duration_minutes)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Name + price */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-(family-name:--font-playfair) text-white font-semibold text-base leading-snug">
                      {service.name}
                    </h3>
                    <span className="text-gold text-sm font-semibold shrink-0 mt-0.5">
                      {formatPrice(service.price)}+
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-white/45 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Book Now */}
                  <Link
                    href={`/book?service=${service.id}`}
                    className="block text-center py-2.5 border border-gold/70 text-gold text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Coming soon state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-24 text-center"
          >
            <p className="text-gold text-2xl mb-4">✦</p>
            <h3 className="font-(family-name:--font-playfair) text-white text-2xl font-semibold mb-3">
              Kids Services Coming Soon
            </h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
              We&apos;re preparing a dedicated menu of gentle, child-friendly styles.
              Check back shortly or contact us for availability.
            </p>
          </motion.div>
        )}

      </div>
    </section>
  )
}
