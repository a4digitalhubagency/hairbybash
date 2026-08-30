'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice, formatDuration, isBookableOnline } from '@/lib/format'
import { groupByCategory } from '@/lib/services'
import type { Category, Service } from '@/types'

interface StepServiceProps {
  categories: Category[]
  services: Service[]
  selectedService: Service | null
  /** null = showing the category grid; otherwise the open category's services. */
  openCategoryId: string | null
  onOpenCategory: (categoryId: string | null) => void
  onSelect: (service: Service) => void
}

function ServiceThumbnail({ service, isSelected }: { service: Service; isSelected: boolean }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-dark-card">
      {!loaded && <div className="absolute inset-0 bg-white/8 animate-pulse" />}
      <Image
        src={service.image_url ?? '/images/services/MediumKnotlessBraids.webp'}
        alt={service.name}
        fill
        className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        sizes="80px"
        unoptimized={!!service.image_url}
        onLoad={() => setLoaded(true)}
      />
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-gold/30 flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>
  )
}

export default function StepService({
  categories,
  services,
  selectedService,
  openCategoryId,
  onOpenCategory,
  onSelect,
}: StepServiceProps) {
  const byCategory = useMemo(() => groupByCategory(services), [services])

  const openCategory = openCategoryId
    ? (categories.find((c) => c.id === openCategoryId) ?? null)
    : null
  const categoryServices = openCategoryId ? (byCategory.get(openCategoryId) ?? []) : []

  // ── Category grid ──────────────────────────────────────────────────────────
  if (!openCategory) {
    return (
      <div>
        <h2 className="font-(family-name:--font-playfair) font-bold text-2xl md:text-3xl text-white mb-1">
          What are we creating?
        </h2>
        <p className="text-white/40 text-sm mb-8">
          Pick a category to see the styles available.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category, i) => {
            const items = byCategory.get(category.id) ?? []
            // Price the category from what a client can actually pay for — a
            // $0 service is rejected at checkout and must not headline here.
            const bookable = items.filter(isBookableOnline)
            const from = bookable.length ? Math.min(...bookable.map((s) => s.price)) : null

            return (
              <motion.button
                key={category.id}
                onClick={() => onOpenCategory(category.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group w-full text-left rounded-2xl border border-white/8 bg-dark-card p-5 hover:border-gold/50 hover:bg-gold/5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-(family-name:--font-playfair) font-bold text-lg text-white group-hover:text-gold transition-colors">
                    {category.name}
                  </p>
                  <svg className="w-4 h-4 text-white/25 group-hover:text-gold shrink-0 mt-1.5 transition-all duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {category.description && (
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-3">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/50">
                    {items.length} {items.length === 1 ? 'style' : 'styles'}
                  </span>
                  {from !== null && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="text-gold font-medium">from {formatPrice(from)}</span>
                    </>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Services within the open category ──────────────────────────────────────
  return (
    <div>
      <button
        onClick={() => onOpenCategory(null)}
        className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All categories
      </button>

      <h2 className="font-(family-name:--font-playfair) font-bold text-2xl md:text-3xl text-white mb-1">
        {openCategory.name}
      </h2>
      <p className="text-white/40 text-sm mb-8">
        {categoryServices.length} {categoryServices.length === 1 ? 'style' : 'styles'} available — choose one to continue.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={openCategory.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {categoryServices.map((service, i) => {
            const isSelected = selectedService?.id === service.id
            return (
              <motion.button
                key={service.id}
                onClick={() => onSelect(service)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`group w-full text-left rounded-2xl border p-4 flex gap-4 transition-all duration-200 ${
                  isSelected
                    ? 'bg-gold/8 border-gold/60'
                    : 'bg-dark-card border-white/8 hover:border-white/20'
                }`}
              >
                <ServiceThumbnail service={service} isSelected={isSelected} />

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm leading-tight mb-1 transition-colors ${
                      isSelected ? 'text-gold' : 'text-white group-hover:text-white'
                    }`}
                  >
                    {service.name}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-sm">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-white/30 text-xs">·</span>
                    <span className="text-white/40 text-xs">
                      {formatDuration(service.duration_minutes)}
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-1 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                    isSelected ? 'border-gold bg-gold' : 'border-white/20'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
