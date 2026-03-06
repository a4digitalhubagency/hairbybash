// components/contact/ContactHero.tsx
'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function ContactHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 text-center bg-dark">
      <div className="max-w-3xl mx-auto">

        {/* Label */}
        <motion.p
          className="text-gold text-xs tracking-[0.3em] uppercase mb-6 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          Say Hello
        </motion.p>

        {/* Heading */}
        <motion.h1
          className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Let&apos;s Talk Hair
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          Have a question or want to explore what&apos;s possible for your hair?
          Reach out — Bash responds personally.
        </motion.p>

      </div>
    </section>
  )
}
