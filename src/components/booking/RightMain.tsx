import { useBooking } from '@/hooks/useBooking'
import { Skeleton } from '@/components/ui/skeleton'
import { IdleView } from './IdleView'
import { BookingModal } from './BookingModal'
import { UnifiedSeatView } from './UnifiedSeatView'
import { PaymentView } from './PaymentView'
import { ConfirmationView } from './ConfirmationView'

function RightMainSkeleton() {
  return (
    <div className="h-full p-6 flex flex-col gap-4">
      <Skeleton className="flex-[3] w-full rounded-xl" />
      <div className="flex-[2] space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-8" />
        ))}
      </div>
    </div>
  )
}

export function RightMain() {
  const { bookingState, isLoading } = useBooking()

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto bg-background">
      {isLoading ? (
        <RightMainSkeleton />
      ) : bookingState === 'idle' || bookingState === 'vqa' || bookingState === 'queue' ? (
        <IdleView />
      ) : bookingState === 'seats-section' || bookingState === 'seats-individual' || bookingState === 'payment' ? (
        <div key="seats-unified" className="h-full animate-in fade-in duration-200">
          <UnifiedSeatView />
        </div>
      ) : bookingState === 'confirmation' ? (
        <div key="confirmation" className="h-full animate-in fade-in duration-200">
          <ConfirmationView />
        </div>
      ) : null}

      {/* BookingModal overlays on top when VQA or Queue is active */}
      {(bookingState === 'vqa' || bookingState === 'queue') && <BookingModal />}

      {/* PaymentView overlays on top of SeatSelectionView */}
      {bookingState === 'payment' && <PaymentView />}
    </div>
  )
}
