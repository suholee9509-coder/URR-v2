import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'

const sizeStyles = {
  sm: 'text-sm font-medium',
  default: 'text-base font-semibold',
  lg: 'text-2xl font-bold',
}

interface PriceDisplayProps {
  amount: number
  size?: 'sm' | 'default' | 'lg'
  showCurrency?: boolean
  className?: string
}

export function PriceDisplay({ amount, size = 'default', showCurrency = true, className }: PriceDisplayProps) {
  const formatted = showCurrency ? formatPrice(amount) : new Intl.NumberFormat('ko-KR').format(amount)

  return (
    <span className={cn('tabular-nums', sizeStyles[size], className)}>
      {formatted}
    </span>
  )
}
