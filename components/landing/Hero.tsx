'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  return (
    <section className="relative h-screen min-h-160 flex items-center overflow-hidden">
      <Image
        src="/images/hero.webp"
        alt="HairbyBash — Calgary Braider & Loctician"
        fill
        className="object-cover object-top"
        priority
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-lg">

          {/* Label */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <motion.div
              className="h-px bg-gold"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
              Luxury Hair Care
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            Calgary Braider
          </motion.h1>

          <motion.p
            className="font-script text-5xl md:text-6xl lg:text-7xl text-gold leading-snug mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            & Loctician
          </motion.p>

          {/* Body */}
          <motion.p
            className="text-white/70 text-base md:text-lg max-w-md mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease }}
          >
            Elevating your crown with precision braids and loc maintenance.
            Experience luxury hair care tailored specifically to you.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
          >
            <Link
              href="/book"
              className="px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="px-7 py-3 border border-white/40 text-white text-sm rounded hover:border-white/80 transition-colors"
            >
              View Services →
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
