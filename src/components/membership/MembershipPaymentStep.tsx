import { PaymentDialog } from '@/components/common/PaymentDialog'
import type { Artist } from '@/types'

interface MembershipPaymentStepProps {
  artist: Artist
  onBack: () => void
  onComplete: () => void
}

export function MembershipPaymentStep({ artist, onBack, onComplete }: MembershipPaymentStepProps) {
  return (
    <PaymentDialog
      open
      title={`${artist.name} 멤버십 결제`}
      orderDescription={`${artist.name} 멤버십 (1년)`}
      orderItems={[
        { label: '멤버십 연회비', amount: 30000 },
      ]}
      totalAmount={30000}
      onComplete={onComplete}
      onCancel={onBack}
    />
  )
}
