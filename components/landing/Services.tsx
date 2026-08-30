import Link from 'next/link'
import { getActiveServices, getActiveCategories, groupByCategory } from '@/lib/services'
import { isBookableOnline } from '@/lib/format'
import CategoryGrid, { type CategoryCard } from './CategoryGrid'

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-dark py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-(family-name:--font-playfair) font-bold text-4xl text-white mb-2">
              Our Services
            </h2>
            <p className="text-white/50 text-sm">
              Browse by category — every style, its price and how long it takes.
            </p>
          </div>
          <Link href="/services" className="text-gold text-sm hover:underline hidden md:inline">
            View Full Menu →
          </Link>
        </div>
        {children}
      </div>
    </section>
  )
}

export default async function Services() {
  let cards: CategoryCard[] = []

  try {
    const [categories, services] = await Promise.all([
      getActiveCategories(),
      getActiveServices(),
    ])
    const byCategory = groupByCategory(services)

    cards = categories.map((category) => {
      const items = byCategory.get(category.id) ?? []
      // Only price the category from styles a client can actually pay for.
      const bookable = items.filter(isBookableOnline)
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        styleCount: items.length,
        fromPrice: bookable.length ? Math.min(...bookable.map((s) => s.price)) : null,
      }
    })
  } catch (err) {
    // Don't crash the entire landing page over one section.
    console.error('[Services section] Failed to load:', err)
    return (
      <SectionShell>
        <div className="py-16 text-center rounded-2xl border border-white/5">
          <p className="text-white/30 text-sm">
            Services are temporarily unavailable. Please try again shortly.
          </p>
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell>
      {cards.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-white/40 text-base">Services coming soon — check back shortly.</p>
        </div>
      ) : (
        <>
          <CategoryGrid categories={cards} />
          <div className="mt-8 text-center md:hidden">
            <Link href="/services" className="text-gold text-sm hover:underline">
              View Full Menu →
            </Link>
          </div>
        </>
      )}
    </SectionShell>
  )
}
