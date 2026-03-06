'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-dark flex flex-col lg:flex-row overflow-hidden">

      {/* Ambient warm glow — gives depth to the dark bg */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-150 h-150 rounded-full bg-gold/4 blur-3xl" />

      {/* ── Left column — text ── */}
      <div className="relative flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-28 lg:py-0 order-2 lg:order-1 z-10">

        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-7"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <motion.div
            className="h-px bg-gold shrink-0"
            initial={{ width: 0 }}
            animate={{ width: 28 }}
            transition={{ duration: 0.45, delay: 0.1, ease }}
          />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-medium">
            Luxury Hair Care · Calgary, AB
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl xl:text-7xl text-white leading-[1.1] tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease }}
        >
          Calgary Braider
        </motion.h1>

        <motion.p
          className="font-script text-[3.5rem] md:text-[4.5rem] xl:text-[5.5rem] text-gold leading-none mt-1 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease }}
        >
          & Loctician
        </motion.p>

        {/* Thin divider */}
        <motion.div
          className="h-px bg-white/10 max-w-50 mb-7"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.32, ease }}
        />

        {/* Body */}
        <motion.p
          className="text-white/55 text-base md:text-[17px] max-w-sm mb-9 leading-[1.75]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.38, ease }}
        >
          Elevating your crown with precision braids and loc maintenance.
          Every appointment is a luxury experience crafted just for you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48, ease }}
        >
          <Link
            href="/book"
            className="px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
          >
            Book Appointment
          </Link>
          <Link
            href="/services"
            className="px-7 py-3 border border-white/25 text-white/80 text-sm rounded hover:border-white/60 hover:text-white transition-colors"
          >
            View Services →
          </Link>
        </motion.div>

        {/* Trust signal */}
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white/35 text-xs">Trusted by Calgary clients</span>
        </motion.div>

      </div>

      {/* ── Right column — portrait image ── */}
      <div className="relative w-full lg:w-[46%] flex items-center justify-center px-8 py-16 lg:py-20 order-1 lg:order-2">

        {/* Subtle right-side background tint to separate columns */}
        <div className="absolute inset-0 bg-dark-surface/40 hidden lg:block" />

        <motion.div
          className="relative w-full max-w-75 sm:max-w-85"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease }}
        >
          {/* Gold editorial offset frame */}
          <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-gold/25 pointer-events-none" />

          {/* Image */}
          <div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden">
            <Image
              src="/images/heroHairByBash.webp"
              alt="HairbyBash — Calgary Braider & Loctician"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 340px"
            />
            {/* Inner vignette ring for depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/8 rounded-2xl" />
            {/* Subtle bottom fade to blend into section */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/30 to-transparent" />
          </div>

          {/* Floating badge */}
          <motion.div
            className="absolute -left-4 bottom-14 bg-dark-card border border-gold/20 rounded-xl px-4 py-3 shadow-2xl"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.65, ease }}
          >
            <p className="text-gold text-[9px] font-semibold tracking-[0.22em] uppercase mb-0.5">
              ✦ Calgary&apos;s Premier
            </p>
            <p className="text-white text-[13px] font-semibold">Braid &amp; Loc Studio</p>
          </motion.div>

        </motion.div>

      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span className="text-white/25 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-6 bg-white/20 origin-top"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

    </section>
  )
}
