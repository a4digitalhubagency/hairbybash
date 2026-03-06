'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <Image
        src="/images/heronew.webp"
        alt="HairbyBash — Calgary Braider & Loctician"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

        {/* Label */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <motion.div
            className="h-px bg-gold shrink-0"
            initial={{ width: 0 }}
            animate={{ width: 24 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-medium">
            Luxury Hair Care
          </span>
          <motion.div
            className="h-px bg-gold shrink-0"
            initial={{ width: 0 }}
            animate={{ width: 24 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease }}
        >
          Calgary Braider
        </motion.h1>

        <motion.p
          className="font-script text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] text-gold leading-none mt-1 mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease }}
        >
          & Loctician
        </motion.p>

        {/* Body */}
        <motion.p
          className="text-white/70 text-base md:text-lg leading-relaxed mb-9 max-w-md mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.36, ease }}
        >
          Elevating your crown with precision braids and loc maintenance.
          Experience luxury hair care tailored specifically to you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48, ease }}
        >
          <Link
            href="/book"
            className="px-8 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
          >
            Book Appointment
          </Link>
          <Link
            href="/services"
            className="px-8 py-3 border border-white/40 text-white text-sm rounded hover:border-white/80 transition-colors"
          >
            View Services →
          </Link>
        </motion.div>

      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span className="text-white/30 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-6 bg-white/25 origin-top"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

    </section>
  )
}
