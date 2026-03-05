// app/contact/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactChannels from '@/components/contact/ContactChannels'
import ContactInfo from '@/components/contact/ContactInfo'

export const metadata: Metadata = {
  title: 'Contact | HairbyBash',
  description: 'Get in touch with HairbyBash. Reach Bash via WhatsApp, email, or Instagram DM.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark">
        <ContactHero />
        <ContactChannels />
        <ContactInfo />
      </main>
      <Footer />
    </>
  )
}
