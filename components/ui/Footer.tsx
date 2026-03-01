import Link from 'next/link'
import Image from 'next/image'

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services Menu', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Policies & FAQ', href: '/faq' },
]

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/hairbybashlogo-removebg.webp"
                alt="HairbyBash"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Calgary&apos;s premier destination for luxury braiding and natural hair
              care services. Quality over quantity, always.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/45 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/45 text-sm">
                <span className="mt-0.5">📍</span> Calgary, Alberta
              </li>
              <li className="flex items-start gap-2 text-white/45 text-sm">
                <span className="mt-0.5">🏠</span> Private Studio (address upon booking)
              </li>
              <li className="flex items-start gap-2 text-white/45 text-sm">
                <span className="mt-0.5">✉️</span> hello@hairbybash.ca
              </li>
              <li className="flex items-start gap-2 text-white/45 text-sm">
                <span className="mt-0.5">🕐</span> Mon–Sat, 9am–6pm
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/hairbybash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors text-xs font-medium"
              >
                IG
              </a>
              <a
                href="https://tiktok.com/@hairbybash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors text-xs font-medium"
              >
                TK
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 HairbyBash. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
