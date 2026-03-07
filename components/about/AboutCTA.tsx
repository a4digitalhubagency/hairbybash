// components/about/AboutCTA.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-60px' } as const

export default function AboutCTA() {
  return (
    <section className="py-24 px-6 bg-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden border border-gold/15 bg-dark-card px-8 py-16 text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, ease }}
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 bg-gold/[0.03]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-gold/8 blur-3xl rounded-full" />

          <div className="relative z-10">
            {/* Label */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={{ delay: 0.2, ease }}
            >
              <div className="h-px bg-gold/50 w-5" />
              <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-medium">Ready to Elevate Your Crown?</span>
              <div className="h-px bg-gold/50 w-5" />
            </motion.div>

            <motion.h2
              className="font-(family-name:--font-playfair) font-bold text-4xl md:text-5xl text-white mb-3"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: 0.18, ease }}
            >
              Book Your Experience
            </motion.h2>

            <motion.p
              className="font-script text-2xl text-gold mb-6"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: 0.26, ease }}
            >
              with Bash
            </motion.p>

            <motion.p
              className="text-white/45 text-[15px] leading-[1.8] max-w-sm mx-auto mb-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.32, ease }}
            >
              Every appointment is a private, premium session focused entirely on you. No rushing, no double bookings — just perfection.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.4, ease }}
            >
              <Link
                href="/book"
                className="px-8 py-3.5 bg-gold text-black font-semibold text-sm rounded-full hover:bg-gold-hover transition-colors shadow-lg"
              >
                Book Appointment
              </Link>
              <Link
                href="https://instagram.com/hairbybash01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white/75 text-sm rounded-full hover:border-white/50 hover:text-white transition-all"
              >
                Follow on Instagram
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
