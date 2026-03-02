'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Toast, { type ToastMessage } from '@/components/ui/Toast'

let toastId = 0

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function addToast(message: string, type: ToastMessage['type'] = 'error') {
    setToasts((prev) => [...prev, { id: `t-${++toastId}`, message, type }])
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      setLoading(false)
      addToast(
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : error.message,
      )
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  const inputBase =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-gold transition-colors duration-200'

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/hairbybashlogo-removebg.webp"
              alt="HairbyBash"
              width={120}
              height={40}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>

          {/* Card */}
          <div className="bg-dark-card border border-white/8 rounded-2xl px-8 py-8">
            <h1 className="font-(family-name:--font-playfair) font-bold text-2xl text-white mb-1 text-center">
              Admin Login
            </h1>
            <p className="text-white/40 text-sm text-center mb-8">
              Sign in to your dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bash@hairbybash.ca"
                  autoComplete="email"
                  required
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={inputBase}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold text-black font-semibold text-sm rounded-xl hover:bg-gold-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-white/20 text-xs text-center mt-6">
            HairbyBash Admin · Restricted access
          </p>
        </div>
      </div>
    </>
  )
}
