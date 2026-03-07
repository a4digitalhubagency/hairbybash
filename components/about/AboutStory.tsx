// components/about/AboutStory.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-100px' } as const

export default function AboutStory() {
  return (
    <section className="py-20 px-6 bg-dark">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-white mb-6">
              Artistry in Every Strand
            </h2>
          <hr className="border-gold border-2 w-24 my-4 rounded-full mr-auto" />
            
            <div className="space-y-4 text-white/60 text-base leading-relaxed">
              <p>
                With over a decade of experience in luxury hair styling, Bash has 
                redefined the salon experience in Calgary. Her passion for artistry 
                and dedication to detail ensures every client leaves feeling 
                powerful and beautiful.
              </p>
              <p>
                Specializing in bespoke coloring, precision cutting, and high-end 
                extensions, Bash combines technical mastery with a deep 
                understanding of individual aesthetics. Her approach is personal, 
                sophisticated, and always ahead of the curve.
              </p>
            </div>
          </motion.div>

 {/* Right - Image */}
     <motion.div
     className="relative w-full max-w-md mx-auto"
     initial={{ opacity: 0, x: 30 }}
     whileInView={{ opacity: 1, x: 0 }}
     viewport={viewport}
     transition={{ duration: 0.7, ease }}
     >
  {/* Outer glow (like Hero) */}
      <div className="absolute inset-0 bg-gold/10 blur-2xl scale-105 rounded-2xl" />

  {/* Image container (same concept as Hero) */}
     <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-dark-card">
    <Image
      src="/images/about/about2.webp"
      alt="Workspace image"
      fill
      className="object-cover"
    />
  </div>
    </motion.div>

        </div>
      </div>
    </section>
  )
}