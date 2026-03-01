'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-60px' } as const

export default function CTA() {
  return (
    <section className="bg-gold py-20 px-6 overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">

        <motion.h2
          className="font-(family-name:--font-playfair) font-bold text-4xl md:text-5xl text-black leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease }}
        >
          Ready to Transform Your Look?
        </motion.h2>

        <motion.p
          className="text-black/65 text-base leading-relaxed mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, delay: 0.12, ease }}
        >
          Appointments fill up fast. Secure your spot today and experience the
          best hair care in Calgary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.22, ease }}
        >
          <Link
            href="/book"
            className="inline-block px-10 py-4 bg-black text-white font-semibold text-sm rounded hover:bg-neutral-900 transition-colors"
          >
            Book Your Appointment
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
