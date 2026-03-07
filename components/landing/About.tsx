'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-60px' } as const

const PILLARS = [
  { icon: '✦', label: 'Premium Products' },
  { icon: '✦', label: 'Private Suite' },
  { icon: '✦', label: 'Healthy Hair Focus' },
  { icon: '✦', label: 'No Double Bookings' },
]

export default function About() {
  return (
    <section className="bg-dark py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* ── Left — Image ── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.75, ease }}
        >
          {/* Gold offset frame */}
          <div className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl border border-gold/20 pointer-events-none" />

          {/* Image */}
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
            <Image
              src="/images/about/about2.webp"
              alt="Artistry in Every Strand — HairbyBash"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Inner vignette */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/8 rounded-2xl" />
          </div>

          {/* Experience badge */}
          <motion.div
            className="absolute bottom-8 right-0 translate-x-1/4 bg-dark-card border border-gold/25 px-5 py-4 rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.4, ease }}
          >
            <p className="font-(family-name:--font-playfair) text-gold text-3xl font-bold leading-none">3+</p>
            <p className="text-white/55 text-[11px] mt-1 leading-snug">Years of<br />Excellence</p>
          </motion.div>
        </motion.div>

        {/* ── Right — Content ── */}
        <div>
          {/* Section label */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease }}
          >
            <div className="h-px bg-gold w-6 shrink-0" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-medium">
              Artistry in Every Strand
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="font-(family-name:--font-playfair) font-bold text-4xl md:text-5xl text-white leading-tight mb-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.08, ease }}
          >
            More Than Just a Hairstyle,
          </motion.h2>
          <motion.p
            className="font-script text-4xl md:text-5xl text-gold leading-snug mb-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.16, ease }}
          >
            It&apos;s an Experience.
          </motion.p>

          {/* Thin divider */}
          <motion.div
            className="h-px bg-white/8 mb-7"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.22, ease }}
          />

          <motion.p
            className="text-white/55 text-[15px] leading-[1.8] mb-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.24, ease }}
          >
            At HairbyBash, we believe that your hair is your crown. Located in the
            heart of Calgary, we specialize in protective styling that not only looks
            stunning but promotes healthy hair growth.
          </motion.p>
          <motion.p
            className="text-white/55 text-[15px] leading-[1.8] mb-8"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.32, ease }}
          >
            From intricate knotless braids to meticulous loc maintenance, every
            appointment is a private, premium session focused entirely on you.
            No double bookings, no rushing — just perfection.
          </motion.p>

          {/* Pillars */}
          <motion.div
            className="grid grid-cols-2 gap-3 mb-9"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.38, ease }}
          >
            {PILLARS.map((p) => (
              <div key={p.label} className="flex items-center gap-2.5 bg-dark-card border border-white/5 rounded-xl px-4 py-3">
                <span className="text-gold text-xs">{p.icon}</span>
                <span className="text-white/75 text-sm font-medium">{p.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.45, delay: 0.44, ease }}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:gap-3 transition-all duration-200"
            >
              Meet Bash
              <span className="text-base leading-none">→</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
