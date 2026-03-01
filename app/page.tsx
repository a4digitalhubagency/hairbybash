import { Suspense } from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Hero from '@/components/landing/Hero'
import About from '@/components/landing/About'
import Services from '@/components/landing/Services'
import ServicesSkeleton from '@/components/landing/ServicesSkeleton'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'

// Revalidate the landing page at most once per hour (ISR)
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        {/* Stream Services independently — skeleton shows while Supabase fetches */}
        <Suspense fallback={<ServicesSkeleton />}>
          <Services />
        </Suspense>
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
