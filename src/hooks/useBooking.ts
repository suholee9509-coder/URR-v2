import { useContext } from 'react'
import { BookingContext } from '@/contexts/BookingContext'
import type { BookingContextValue } from '@/contexts/BookingContext'

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
