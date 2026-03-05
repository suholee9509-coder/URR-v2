import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Footer } from './Footer'
import type { ReactNode } from 'react'

interface ContentAreaProps {
  children: ReactNode
}

export function ContentArea({ children }: ContentAreaProps) {
  const { pathname } = useLocation()
  // Booking pages (/events/:eventId) use full width
  const isFullWidth = /^\/events\/[^/]+$/.test(pathname)

  return (
    <main className={cn('flex-1', isFullWidth ? 'overflow-hidden' : 'overflow-y-auto')}>
      <div
        className={cn(
          !isFullWidth && 'px-8 py-6 max-w-[1200px] mx-auto',
          isFullWidth && 'h-full',
        )}
      >
        {children}
      </div>
      {!isFullWidth && (
        <>
          <div className="h-20" />
          <Footer />
        </>
      )}
    </main>
  )
}
