import { cn } from '@/lib/utils'
import type { TierLevel } from '@/types'
import { TIER_LABELS, TIER_EMOJIS } from '@/types'

const tierStyles: Record<TierLevel, string> = {
  diamond: 'bg-tier-diamond-bg text-tier-diamond',
  gold: 'bg-tier-gold-bg text-tier-gold',
  silver: 'bg-tier-silver-bg text-tier-silver',
  bronze: 'bg-tier-bronze-bg text-tier-bronze',
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  default: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-1.5',
}

interface TierBadgeProps {
  tier: TierLevel
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
  className?: string
}

export function TierBadge({ tier, size = 'default', showLabel = true, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold shrink-0',
        tierStyles[tier],
        sizeStyles[size],
        className,
      )}
      aria-label={`${TIER_LABELS[tier]} 등급`}
    >
      <span>{TIER_EMOJIS[tier]}</span>
      {showLabel && <span>{TIER_LABELS[tier]}</span>}
    </span>
  )
}
