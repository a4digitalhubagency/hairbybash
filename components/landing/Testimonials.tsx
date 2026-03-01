'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    quote:
      'Bash is incredibly talented. My knotless braids are always neat, lightweight, and last for weeks. The best service in Calgary, hands down.',
    name: 'Sarah Jenkins',
    role: 'Loyal Customer',
    initials: 'SJ',
  },
  {
    quote:
      'Found my forever loctician! The studio is so calming and private. She really cares about the health of your hair, not just the style.',
    name: "Marissa O'Neil",
    role: 'Loyal Customer',
    initials: 'MO',
  },
  {
    quote:
      'Absolutely worth every penny. My box braids lasted 3 months and still looked fresh. Will never go anywhere else!',
    name: 'Aisha Williams',
    role: 'New Customer',
    initials: 'AW',
  },
  {
    quote:
      'Professional, on time, and so talented. The loc retwist was perfection. My hair has never looked better.',
    name: 'Destiny Brown',
    role: 'Repeat Customer',
    initials: 'DB',
  },
]

const ease = [0.25, 0.46, 0.45, 0.94] as const

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-gold text-sm">★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const totalPages = Math.ceil(TESTIMONIALS.length / 2)
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)

  const visible = TESTIMONIALS.slice(page * 2, page * 2 + 2)

  const paginate = (dir: 1 | -1) => {
    setDirection(dir)
    setPage((p) => (p + dir + totalPages) % totalPages)
  }

  return (
    <section className="bg-dark-surface py-24 px-6">
      <div className="max-w-7xl mx-auto overflow-hidden">

        <motion.p
          className="text-center text-gold text-xs tracking-[0.3em] uppercase mb-14 font-medium"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
        >
          Client Love
        </motion.p>

        {/* Cards — popLayout removes exiting card from flow immediately */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease }}
            className="grid md:grid-cols-2 gap-6 mb-10"
          >
              {visible.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease }}
                  className="bg-dark-card border border-white/5 rounded-xl p-8 flex flex-col"
                >
                  <Stars />
                  <p className="text-white/65 text-base leading-relaxed mb-6 italic flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-black text-xs font-bold shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="text-white/40 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous testimonials"
            className="group w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-gold/60 hover:text-gold transition-all duration-300"
          >
            <span className="text-sm transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > page ? 1 : -1); setPage(i) }}
                aria-label={`Go to page ${i + 1}`}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === page ? 24 : 6 }}
              >
                <span className="absolute inset-0 bg-white/20 rounded-full" />
                {i === page && (
                  <motion.span
                    layoutId="dot"
                    className="absolute inset-0 bg-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            aria-label="Next testimonials"
            className="group w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-gold/60 hover:text-gold transition-all duration-300"
          >
            <span className="text-sm transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </button>
        </div>

      </div>
    </section>
  )
}
