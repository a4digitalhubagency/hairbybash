'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice, formatDuration } from '@/lib/format'
import type { Service } from '@/types'

const CATEGORIES = ['All', 'Braids', 'Locs', 'Twists', 'Cornrows', 'Kids']

interface StepServiceProps {
  services: Service[]
  selectedService: Service | null
  onSelect: (service: Service) => void
}

export default function StepService({ services, selectedService, onSelect }: StepServiceProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory)

  return (
    <div>
      <h2 className="font-(family-name:--font-playfair) font-bold text-2xl md:text-3xl text-white mb-1">
        Select Your Service
      </h2>
      <p className="text-white/40 text-sm mb-8">
        Choose the treatment for your next appointment.
      </p>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide py-1 md:justify-start">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="relative shrink-0 px-4 py-1.5 rounded-full text-xs font-medium outline-none"
          >
            {activeCategory === cat && (
              <motion.span
                layoutId="booking-category-pill"
                className="absolute inset-0 bg-gold rounded-full"
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                activeCategory === cat
                  ? 'text-black'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* Service grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center rounded-2xl border border-white/5"
            >
              <p className="text-gold text-xl mb-3">✦</p>
              <p className="font-(family-name:--font-playfair) text-white text-lg font-semibold mb-2">
                Kids Services Coming Soon
              </p>
              <p className="text-white/35 text-sm max-w-xs mx-auto leading-relaxed">
                A dedicated children&apos;s menu is on its way. Contact us for early availability.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((service, i) => {
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
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={service.image_url ?? '/images/services/MediumKnotlessBraids.webp'}
                        alt={service.name}
                        fill
                        className="object-cover"
                        sizes="80px"
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

                    {/* Info */}
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

                    {/* Radio indicator */}
                    <div
                      className={`mt-1 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                        isSelected ? 'border-gold bg-gold' : 'border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
