// app/about/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutStory from '@/components/about/AboutStory'
import AboutJourney from '@/components/about/AboutJourney'
import AboutCTA from '@/components/about/AboutCTA'

export const metadata: Metadata = {
  title: 'About | HairbyBash',
  description: 'Meet Bash - The visionary behind HairbyBash.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark">
        <AboutHero />
        <AboutStory />
        <AboutJourney />
        <AboutCTA />
      </main>
      <Footer />
    </>
  )
}