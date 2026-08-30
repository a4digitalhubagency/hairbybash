'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/format'

export interface CategoryCard {
  id: string
  name: string
  slug: string
  description: string | null
  styleCount: number
  /** Cheapest bookable style, or null when none can be booked online. */
  fromPrice: number | null
}

export default function CategoryGrid({ categories }: { categories: CategoryCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category, i) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Link
            href={`/services?category=${category.slug}`}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-dark-card p-6 transition-all duration-300 hover:border-gold/50 hover:bg-gold/5"
          >
            {/* Corner glow on hover */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <h3 className="font-(family-name:--font-playfair) text-xl font-bold text-white transition-colors duration-300 group-hover:text-gold">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/40">
                  {category.description}
                </p>
              )}
            </div>

            <div className="relative mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-white/45">
                  {category.styleCount} {category.styleCount === 1 ? 'style' : 'styles'}
                </p>
                {category.fromPrice !== null && (
                  <p className="mt-0.5 text-sm font-semibold text-gold">
                    from {formatPrice(category.fromPrice)}
                  </p>
                )}
              </div>
              <span className="text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
