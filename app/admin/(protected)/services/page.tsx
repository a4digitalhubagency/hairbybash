import { createAdminClient } from '@/lib/supabase/admin'
import ServicesTable from '@/components/admin/ServicesTable'
import CategoriesManager, { type CategoryWithCount } from '@/components/admin/CategoriesManager'
import type { Category, Service } from '@/types'

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default async function ServicesPage() {
  const admin = createAdminClient()

  const [servicesRes, availabilityRes, categoriesRes] = await Promise.all([
    admin
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true }),

    // The form warns when a service is too long to fit any open day. That
    // threshold has to come from the same table getAvailableSlots reads, or the
    // two drift and the warning silently goes stale.
    admin.from('weekly_availability').select('start_time, end_time'),

    // Admin sees every category, including hidden ones — unlike the public
    // pages, which only ever see active ones.
    admin
      .from('categories')
      .select('*, services(id)')
      .order('display_order', { ascending: true }),
  ])

  const services = (servicesRes.data ?? []) as Service[]

  const longestWindowMinutes = (availabilityRes.data ?? []).reduce(
    (longest, row) => Math.max(longest, toMinutes(row.end_time) - toMinutes(row.start_time)),
    0,
  )

  const categoriesWithCounts: CategoryWithCount[] = (categoriesRes.data ?? []).map(
    ({ services: categoryServices, ...category }) => ({
      ...(category as Category),
      serviceCount: (categoryServices as unknown[] | null)?.length ?? 0,
    }),
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <CategoriesManager initial={categoriesWithCounts} />
      <ServicesTable
        initialServices={services}
        initialCategories={categoriesWithCounts}
        longestWindowMinutes={longestWindowMinutes}
      />
    </div>
  )
}
