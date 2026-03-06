'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  return (
    <section className="relative h-screen min-h-150 flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <Image
        src="/images/newhero.webp"
        alt="HairbyBash — Calgary Braider & Loctician"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Layered overlays for depth and legibility */}
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Bottom vignette — grounds the section */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-dark to-transparent" />
      {/* Top vignette — ties to navbar */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto w-full">

        {/* Label */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-7"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <motion.div
            className="h-px bg-gold"
            initial={{ width: 0 }}
            animate={{ width: 28 }}
            transition={{ duration: 0.45, delay: 0.1, ease }}
          />
          <span className="text-gold text-[11px] tracking-[0.35em] uppercase font-medium">
            Luxury Hair Care
          </span>
          <motion.div
            className="h-px bg-gold"
            initial={{ width: 0 }}
            animate={{ width: 28 }}
            transition={{ duration: 0.45, delay: 0.1, ease }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-(family-name:--font-playfair) font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease }}
        >
          Calgary Braider
        </motion.h1>

        <motion.p
          className="font-script text-[3.2rem] sm:text-[4rem] lg:text-[5rem] text-gold leading-none mt-1 mb-7 drop-shadow-lg"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease }}
        >
          & Loctician
        </motion.p>

        {/* Thin gold divider */}
        <motion.div
          className="w-12 h-px bg-gold/60 mx-auto mb-7"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.45, delay: 0.34, ease }}
        />

        {/* Body */}
        <motion.p
          className="text-white/70 text-[15px] md:text-base leading-[1.8] mb-9 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
        >
          Elevating your crown with precision braids and loc maintenance.
          Every appointment is a luxury experience crafted just for you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
        >
          <Link
            href="/book"
            className="px-8 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors shadow-lg"
          >
            Book Appointment
          </Link>
          <Link
            href="/services"
            className="px-8 py-3 border border-white/35 text-white text-sm rounded hover:bg-white/10 hover:border-white/60 transition-all"
          >
            View Services →
          </Link>
        </motion.div>

      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

    </section>
  )
}
