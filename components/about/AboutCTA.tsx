// components/about/AboutCTA.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-60px' } as const

export default function AboutCTA() {
  return (
    <section className="py-20 px-6 bg-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-gold rounded-3xl px-8 py-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10">
            {/* Eye icon */}
            <motion.div
              className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
            >
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </motion.div>

            {/* Heading */}
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-black mb-4">
              See the Transformation
            </h2>
            
            {/* Subtext */}
            <p className="text-black/60 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Follow our daily artistry and get a behind-the-scenes look at the 
              HairbyBash experience.
            </p>

            {/* Button */}
            <Link
              href="https://instagram.com/hairbybash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-semibold text-sm rounded-full hover:bg-neutral-900 transition-colors"
            >
              Follow on Instagram
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}