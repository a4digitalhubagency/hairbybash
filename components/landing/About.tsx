'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-80px' } as const

export default function About() {
  return (
    <section className="bg-dark py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.75, ease }}
        >
          <div className="relative aspect-4/5 rounded overflow-hidden border border-white/10">
            <Image
              src="/images/about/story.webp"
              alt="HairbyBash stylist at work"
              fill
              className="object-cover"
            />
          </div>

          {/* Experience badge */}
          <motion.div
            className="absolute bottom-6 left-6 bg-dark/90 border border-white/10 px-5 py-4 rounded backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.35, ease }}
          >
            <p className="font-(family-name:--font-playfair) text-gold text-3xl font-bold leading-none">
              3+
            </p>
            <p className="text-white/60 text-xs mt-1 leading-snug">
              Years of Professional<br />Experience
            </p>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.75, ease }}
        >
          <h2 className="font-(family-name:--font-playfair) font-bold text-4xl md:text-5xl text-white leading-tight mb-1">
            More Than Just a Hairstyle,
          </h2>
          <p className="font-script text-4xl md:text-5xl text-gold leading-snug mb-8">
            It&apos;s an Experience.
          </p>

          <motion.p
            className="text-white/60 text-base leading-relaxed mb-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, delay: 0.2, ease }}
          >
            At HairbyBash, we believe that your hair is your crown. Located in the
            heart of Calgary, we specialize in protective styling that not only looks
            stunning but promotes healthy hair growth.
          </motion.p>
          <motion.p
            className="text-white/60 text-base leading-relaxed mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, delay: 0.3, ease }}
          >
            From intricate knotless braids to meticulous loc maintenance, every
            appointment is a private, premium session focused entirely on you.
            No double bookings, no rushing — just perfection.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.4, ease }}
          >
            <div className="flex items-center gap-3">
              <span className="text-gold">✦</span>
              <span className="text-white/80 text-sm font-medium">Premium Products</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gold">✦</span>
              <span className="text-white/80 text-sm font-medium">Private Suite</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
