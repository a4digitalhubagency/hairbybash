'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice, formatDuration, isBookableOnline } from '@/lib/format'
import { groupByCategory } from '@/lib/services'
import type { Category, Service } from '@/types'

interface ServicesGridProps {
  categories: Category[]
  services: Service[]
  /** Category slug from ?category= — null shows the category grid. */
  activeSlug: string | null
}

export default function ServicesGrid({ categories, services, activeSlug }: ServicesGridProps) {
  const byCategory = groupByCategory(services)
  const active = activeSlug ? (categories.find((c) => c.slug === activeSlug) ?? null) : null

  // ── Category grid ──────────────────────────────────────────────────────────
  if (!active) {
    return (
      <section className="bg-dark pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, i) => {
            const items = byCategory.get(category.id) ?? []
            const bookable = items.filter(isBookableOnline)
            const from = bookable.length ? Math.min(...bookable.map((s) => s.price)) : null

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link
                  href={`/services?category=${category.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-dark-card p-7 transition-all duration-300 hover:border-gold/50 hover:bg-gold/5"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <h2 className="font-(family-name:--font-playfair) text-2xl font-bold text-white transition-colors duration-300 group-hover:text-gold">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2.5 text-sm leading-relaxed text-white/40">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="relative mt-8 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/45">
                        {items.length} {items.length === 1 ? 'style' : 'styles'}
                      </p>
                      {from !== null && (
                        <p className="mt-0.5 text-sm font-semibold text-gold">
                          from {formatPrice(from)}
                        </p>
                      )}
                    </div>
                    <svg className="h-4 w-4 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    )
  }

  // ── Styles within the open category ────────────────────────────────────────
  const items = byCategory.get(active.id) ?? []

  return (
    <section className="bg-dark pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All categories
          </Link>
          <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-white">
            {active.name}
          </h2>
          {active.description && (
            <p className="mt-2 text-white/45 text-sm max-w-xl">{active.description}</p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-white/5">
            <p className="text-gold text-xl mb-3">✦</p>
            <p className="font-(family-name:--font-playfair) text-white text-lg font-semibold mb-2">
              More {active.name} styles coming soon
            </p>
            <p className="text-white/35 text-sm max-w-xs mx-auto leading-relaxed">
              We&apos;re expanding this part of the menu —{' '}
              <Link href="/contact" className="text-gold hover:underline">get in touch</Link>{' '}
              for availability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link
                  href={`/book?service=${service.id}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-white/8 bg-dark-card transition-all duration-300 hover:border-gold/50"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-dark">
                    <Image
                      src={service.image_url ?? '/images/services/MediumKnotlessBraids.webp'}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={!!service.image_url}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <span className="absolute top-4 left-4 inline-flex items-center rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/75 backdrop-blur-sm">
                      {formatDuration(service.duration_minutes)}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-(family-name:--font-playfair) text-lg font-semibold text-white leading-snug transition-colors group-hover:text-gold">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/40">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-xs font-medium text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Book →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
