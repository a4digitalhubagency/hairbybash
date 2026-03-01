import Image from 'next/image'

const PHOTOS = [
  '/images/services/MediumBohoBraids.webp',
  '/images/services/FauxLox.webp',
  '/images/services/StitchCornrows.webp',
  '/images/services/TemporaryLocs.webp',
  '/images/services/PalmrollTwist.webp',
]

export default function InstagramFeed() {
  return (
    <section className="bg-dark py-10 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-5">
          <p className="text-white text-sm">
            <span className="font-script text-gold text-xl">@HairbyBash</span>
            <span className="text-white/50 ml-2">on Instagram</span>
          </p>
          <a
            href="https://instagram.com/hairbybash"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 text-sm hover:text-white transition-colors"
          >
            Follow Us →
          </a>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {PHOTOS.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/hairbybash"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded overflow-hidden block group"
            >
              <Image
                src={src}
                alt={`HairbyBash Instagram photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
