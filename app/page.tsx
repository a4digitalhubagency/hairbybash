import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          HairbyBash
        </h1>
        <p className="text-neutral-500 text-lg">
          Professional hair styling — book your appointment online.
        </p>
        <Link
          href="/services"
          className="inline-block mt-4 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors"
        >
          View Services
        </Link>
      </div>
    </main>
  )
}
