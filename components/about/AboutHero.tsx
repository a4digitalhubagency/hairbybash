// components/about/AboutHero.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 px-6 text-center bg-dark">
      <div className="max-w-4xl mx-auto">
        {/* Label */}
        <motion.p
          className="text-gold text-xs tracking-[0.3em] uppercase mb-8 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          The Visionary
        </motion.p>

        {/* Circular Portrait */}
        <motion.div
          className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease }}
        >
          {/* Gold glow */}
          <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl scale-110" />

          {/* Image */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gold/30 bg-dark-card">
            <Image
              src="/images/about/User.jpg"
              alt="Bash portrait"
              fill
              priority
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Meet Bash
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-white/50 text-base max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          Master Stylist & Founder. Redefining luxury hair artistry in the heart of Calgary.
        </motion.p>
      </div>
    </section>
  )
}