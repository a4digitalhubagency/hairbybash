import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'About | HairbyBash',
  description:
    'Meet Bash — Calgary\'s premier braider and loctician with 3+ years of expertise in protective styling and natural hair care.',
}

const PILLARS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Premium Products Only',
    body: 'Every service uses carefully selected, high-quality products that nourish and protect your natural hair.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: 'Private Studio',
    body: 'Your appointment is yours alone — no double-bookings, no waiting, no distractions. Just a focused, luxurious session.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    title: 'Hair Health First',
    body: 'Beautiful styles that don\'t compromise the integrity of your hair. Protection and growth are always the priority.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Punctual & Reliable',
    body: 'Your time is valuable. Appointments start on time and are paced to deliver perfection without rushing.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark">

        {/* ── Hero ── */}
        <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-dark-surface via-dark to-dark pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
              The Stylist
            </p>
            <h1 className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white leading-tight mb-5">
              About HairbyBash
            </h1>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Passion, precision, and a deep respect for natural hair — that&apos;s what
              drives every appointment at HairbyBash.
            </p>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-4/5 rounded overflow-hidden border border-white/10">
                <Image
                  src="/images/about.webp"
                  alt="HairbyBash stylist at work"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute bottom-6 left-6 bg-dark/90 border border-white/10 px-5 py-4 rounded backdrop-blur-sm">
                <p className="font-(family-name:--font-playfair) text-gold text-3xl font-bold leading-none">
                  3+
                </p>
                <p className="text-white/60 text-xs mt-1 leading-snug">
                  Years of Professional<br />Experience
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="font-(family-name:--font-playfair) font-bold text-4xl md:text-5xl text-white leading-tight mb-1">
                More Than Just a Hairstyle,
              </h2>
              <p className="font-script text-4xl md:text-5xl text-gold leading-snug mb-8">
                It&apos;s an Experience.
              </p>

              <p className="text-white/60 text-base leading-relaxed mb-5">
                At HairbyBash, we believe that your hair is your crown. Located in the
                heart of Calgary, we specialize in protective styling that not only looks
                stunning but promotes healthy hair growth.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-5">
                From intricate knotless braids to meticulous loc maintenance, every
                appointment is a private, premium session focused entirely on you.
                No double bookings, no rushing — just perfection.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-10">
                With 3+ years of professional experience and a commitment to ongoing
                education in hair care techniques, Bash delivers results that speak for
                themselves. Your satisfaction — and your hair health — is the only measure
                of success.
              </p>

              <Link
                href="/book"
                className="inline-block px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
              >
                Book an Appointment
              </Link>
            </div>

          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-medium">Why HairbyBash</p>
              <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-white">
                The HairbyBash Difference
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map((p) => (
                <div key={p.title} className="bg-dark-card border border-white/5 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5">
                    {p.icon}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{p.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 text-center border-t border-white/5">
          <div className="max-w-md mx-auto">
            <span className="text-gold text-xl">♦</span>
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-white mt-4 mb-3 leading-snug">
              Ready for your appointment?
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              Browse the full service menu and book your spot today.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/book"
                className="px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/services"
                className="px-7 py-3 border border-white/30 text-white text-sm rounded hover:border-white/70 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
