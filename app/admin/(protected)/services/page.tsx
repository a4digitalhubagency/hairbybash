import { createAdminClient } from '@/lib/supabase/admin'
import ServicesTable from '@/components/admin/ServicesTable'
import type { Service } from '@/types'

export default async function ServicesPage() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('services')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  const services = (data ?? []) as Service[]

  return (
    <div className="p-6 lg:p-8">
      <ServicesTable initialServices={services} />
    </div>
  )
}
