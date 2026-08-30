'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      {/*
        The bar height comes from --nav-h in globals.css, which is also what
        pages reserve with .pt-nav. Sizing it here with a literal would let the
        two drift and tuck content under the header.
      */}
      <div
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        style={{ height: 'var(--nav-h)' }}
      >
        {/* Logo — the studio's signature, so it leads. Eases down slightly once
            the page is scrolled, which keeps it prominent without crowding. */}
        <Link href="/" className="flex items-center shrink-0" aria-label="HairbyBash — home">
          <Image
            src="/images/hairbybashlogo-removebg.webp"
            alt="HairbyBash"
            width={240}
            height={80}
            className={`w-auto object-contain transition-all duration-300 ${
              scrolled ? 'h-11 md:h-13' : 'h-13 md:h-17'
            }`}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-[13px] font-medium uppercase tracking-label text-white/65 transition-colors duration-200 hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Book Now CTA */}
        <Link
          href="/book"
          className="hidden md:inline-block px-6 py-2.5 bg-gold text-black text-[13px] font-semibold uppercase tracking-label rounded transition-colors duration-200 hover:bg-gold-hover"
        >
          Book Now
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark/98 backdrop-blur-md border-t border-white/5 px-6 pb-7 pt-5 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-label text-white/65 transition-colors hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="mt-1 text-center px-5 py-3 bg-gold text-black text-[13px] font-semibold uppercase tracking-label rounded transition-colors hover:bg-gold-hover"
            onClick={() => setMobileOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}
