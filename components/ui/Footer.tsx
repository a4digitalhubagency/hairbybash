import Link from 'next/link'
import Image from 'next/image'

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services Menu', href: '/services' },
  { label: 'Contact', href: '/contact' },
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
                <span className="mt-0.5">✉️</span> hairbybash01@gmail.com
              </li>
              <li className="flex items-start gap-2 text-white/45 text-sm">
                <span className="mt-0.5">🕐</span> Mon–Sun, 9am–6pm
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
                href="https://www.instagram.com/hairbybash01"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://wa.me/17097715229"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
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
