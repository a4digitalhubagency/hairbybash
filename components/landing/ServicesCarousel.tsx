/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Service } from '@/types'

const CATEGORIES = ['All', 'Braids', 'Locs', 'Twists', 'Cornrows', 'Kids']
const GAP = 20 // matches gap-5

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function ServicesCarousel({ services }: { services: Service[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [translateX, setTranslateX] = useState(0)
  const [canNext, setCanNext] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Always show all categories — Kids shows a coming-soon state when empty
  const availableCategories = CATEGORIES

  const filtered =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory)

  const canPrev = translateX < 0

  // Re-measure canNext after DOM updates (category change or translateX change)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const containerWidth = containerRef.current?.offsetWidth ?? 0
      const trackWidth = trackRef.current?.scrollWidth ?? 0
      const maxTranslate = -(Math.max(0, trackWidth - containerWidth))
      setCanNext(translateX > maxTranslate)
    })
    return () => cancelAnimationFrame(raf)
  }, [translateX, activeCategory])

  // Reset position on category change
  useEffect(() => {
    setTranslateX(0)
  }, [activeCategory])

  const getCardWidth = useCallback(() => {
    const card = trackRef.current?.querySelector('[data-card]') as HTMLElement | null
    return card ? card.offsetWidth + GAP : 300
  }, [])

  const getMaxTranslate = useCallback(() => {
    const containerWidth = containerRef.current?.offsetWidth ?? 0
    const trackWidth = trackRef.current?.scrollWidth ?? 0
    return -(Math.max(0, trackWidth - containerWidth))
  }, [])

  const scrollPrev = () =>
    setTranslateX((prev) => Math.min(0, prev + getCardWidth()))

  const scrollNext = () =>
    setTranslateX((prev) => Math.max(getMaxTranslate(), prev - getCardWidth()))

  // ── Touch swipe ───────────────────────────────────────────────────────────
  const touchStartX = useRef(0)

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      if (delta > 0) scrollNext() // swipe left → next
      else scrollPrev()           // swipe right → prev
    }
  }

  return (
    <div>
      {/* ── Category filter tabs ── */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="relative shrink-0 px-5 py-2 rounded-full text-sm font-medium outline-none"
          >
            {activeCategory === cat && (
              <motion.span
                layoutId="active-pill"
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

      {/* ── Carousel — overflow:hidden = zero scrollbar possible ── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Previous arrow */}
        <button
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Previous services"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-dark/85 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        >
          ←
        </button>

        {/* Animated track — category fade, x-slide for prev/next */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="py-16 text-center w-full"
              >
                <p className="text-gold text-xl mb-3">✦</p>
                <p className="font-(family-name:--font-playfair) text-white text-xl font-semibold mb-2">
                  Kids Services Coming Soon
                </p>
                <p className="text-white/35 text-sm max-w-xs mx-auto leading-relaxed">
                  A dedicated children&apos;s menu is on its way. Contact us for early availability.
                </p>
              </motion.div>
            ) : (
            <motion.div
              ref={trackRef}
              animate={{ x: translateX }}
              transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.9 }}
              className="flex gap-5"
            >
              {filtered.map((service, i) => (
                <div
                  key={service.id}
                  data-card
                  className="shrink-0 w-65 md:w-75 lg:w-[320px]"
                  style={{
                    opacity: hoveredId && hoveredId !== service.id ? 0.35 : 1,
                    transition: 'opacity 0.35s ease',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.07,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Link
                      href={`/book?service=${service.id}`}
                      className="group relative block aspect-3/4 rounded-2xl overflow-hidden"
                      onMouseEnter={() => setHoveredId(service.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <Image
                        src={service.image_url ?? '/images/services/MediumKnotlessBraids.webp'}
                        alt={service.name}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/92 via-black/25 to-transparent" />

                      {/* Gold border on hover */}
                      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-gold/50 transition-colors duration-300" />

                      {/* Duration badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center bg-black/55 backdrop-blur-sm text-white/75 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 font-medium">
                          {formatDuration(service.duration_minutes)}
                        </span>
                      </div>

                      {/* Book Now — reveals on hover */}
                      <div className="absolute top-4 right-4 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                        <span className="inline-block bg-gold text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                          Book Now
                        </span>
                      </div>

                      {/* Text overlay */}
                      <div className="absolute bottom-6 left-5 right-5">
                        <p className="text-gold text-[10px] tracking-[0.25em] uppercase mb-1.5 font-medium">
                          {service.category}
                        </p>
                        <p className="font-(family-name:--font-playfair) text-white font-semibold text-xl leading-snug mb-1.5">
                          {service.name}
                        </p>
                        <p className="text-white/50 text-sm">
                          Starting at {formatPrice(service.price)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next arrow */}
        <button
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Next services"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-dark/85 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        >
          →
        </button>
      </div>

      {/* Count */}
      <p className="text-white/25 text-xs tracking-[0.2em] uppercase font-medium mt-5 text-right">
        {filtered.length} {activeCategory === 'All' ? 'services' : activeCategory.toLowerCase()}
      </p>
    </div>
  )
}
