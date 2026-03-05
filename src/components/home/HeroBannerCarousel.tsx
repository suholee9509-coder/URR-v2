import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react'
import { BookingStatusBadge } from '@/components/urr'
import { getArtistGradient } from '@/data/mock-home'
import type { HomeBannerEvent } from '@/data/mock-home'

interface HeroBannerCarouselProps {
  banners: HomeBannerEvent[]
}

function formatBannerDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-rotate every 5 seconds, pause on hover
  useEffect(() => {
    if (isHovered || banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isHovered, banners.length])

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % banners.length) + banners.length) % banners.length)
    },
    [banners.length],
  )

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])

  if (banners.length === 0) return null

  return (
    <div
      className="group relative overflow-hidden rounded-2xl h-[360px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            to={`/events/${banner.id}`}
            className="relative w-full h-full shrink-0 block"
          >
            {/* Background: image or gradient fallback */}
            {banner.bannerImage ? (
              <img
                src={banner.bannerImage}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: getArtistGradient(banner.artistId) }}
              />
            )}

            {/* Bottom overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8">
              {/* Top: status badge */}
              <div>
                <BookingStatusBadge status={banner.status} />
              </div>

              {/* Bottom: event info */}
              <div className="space-y-2">
                <h2
                  className="text-3xl font-bold text-white leading-tight"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                  {banner.title}
                </h2>
                <p className="text-lg text-white/80">{banner.artistName}</p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatBannerDate(banner.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {banner.venue}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Left arrow */}
      {banners.length > 1 && (
        <button
          onClick={(e) => {
            e.preventDefault()
            goPrev()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm shadow-lg"
          aria-label="이전 배너"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Right arrow */}
      {banners.length > 1 && (
        <button
          onClick={(e) => {
            e.preventDefault()
            goNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm shadow-lg"
          aria-label="다음 배너"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-sm">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault()
                goTo(i)
              }}
              className={`size-2 rounded-full transition-all cursor-pointer ${
                i === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`배너 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
