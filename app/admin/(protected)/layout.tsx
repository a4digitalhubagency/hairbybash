import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already handles unauthenticated redirects, but we double-check
  // here so the layout never renders without a valid session.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-dark">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 min-w-0 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
