// components/about/AboutHero.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const STATS = [
  { value: '3+', label: 'Years of Excellence' },
  { value: '1', label: 'Private Studio' },
  { value: '100%', label: 'Dedicated to You' },
]

export default function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 px-6 bg-dark overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.04] blur-3xl rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">

        {/* Label */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <motion.div className="h-px bg-gold shrink-0" initial={{ width: 0 }} animate={{ width: 24 }} transition={{ duration: 0.4, delay: 0.1, ease }} />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-medium">The Visionary Behind the Brand</span>
          <motion.div className="h-px bg-gold shrink-0" initial={{ width: 0 }} animate={{ width: 24 }} transition={{ duration: 0.4, delay: 0.1, ease }} />
        </motion.div>

        {/* Portrait */}
        <motion.div
          className="relative w-44 h-44 md:w-52 md:h-52 mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <div className="absolute inset-0 rounded-full bg-gold/15 blur-2xl scale-110" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gold/30 bg-dark-card">
            <Image
              src="/images/about/about2.webp"
              alt="Bash — HairbyBash founder"
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
        >
          Meet Bash
        </motion.h1>

        <motion.p
          className="font-script text-3xl text-gold leading-snug mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26, ease }}
        >
          Master Stylist & Founder
        </motion.p>

        {/* Thin divider */}
        <motion.div
          className="w-10 h-px bg-gold/50 mx-auto mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.34, ease }}
        />

        <motion.p
          className="text-white/50 text-[15px] leading-[1.8] max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.38, ease }}
        >
          Redefining luxury hair artistry in the heart of Calgary — one crown at a time.
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-px"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.46, ease }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="px-8 py-4 text-center">
                <p className="font-(family-name:--font-playfair) text-gold text-3xl font-bold leading-none mb-1">{s.value}</p>
                <p className="text-white/40 text-xs tracking-wide">{s.label}</p>
              </div>
              {i < STATS.length - 1 && <div className="w-px h-10 bg-white/8" />}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
