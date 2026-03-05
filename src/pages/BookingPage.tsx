import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLayout } from '@/hooks/useLayout'
import { BookingProvider } from '@/contexts/BookingContext'
import { BookingLayout } from '@/components/booking'

export default function BookingPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { setSidebar } = useLayout()

  // Auto-collapse sidebar on mount, restore on unmount
  useEffect(() => {
    setSidebar('collapsed')
    return () => setSidebar('expanded')
  }, [setSidebar])

  if (!eventId) return null

  return (
    <BookingProvider eventId={eventId}>
      <BookingLayout />
    </BookingProvider>
  )
}
