import { ChevronDown, Loader2, Music, RefreshCw, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TierBadge } from '@/components/urr/TierBadge'
import { getArtistGradient } from '@/data/mock-home'
import { cn } from '@/lib/utils'
import type { Membership } from '@/types'
import { TIER_LABELS } from '@/types'

interface MembershipCardProps {
  membership: Membership
  isExpanded: boolean
  onToggle: () => void
  isMelonLinked: boolean
  isMelonLinking: boolean
  onMelonLink: () => void
  onCancel?: () => void
  isCancelling?: boolean
}

export function MembershipCard({
  membership,
  isExpanded,
  onToggle,
  isMelonLinked,
  isMelonLinking,
  onMelonLink,
  onCancel,
  isCancelling,
}: MembershipCardProps) {
  const expiryDate = new Date(membership.expiresAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const gradient = getArtistGradient(membership.artistId)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        {/* Artist gradient avatar */}
        <div
          className="size-12 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ background: gradient }}
        >
          {membership.artistName.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{membership.artistName}</span>
            <TierBadge tier={membership.tier} size="sm" />
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                membership.isActive
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  membership.isActive ? 'bg-green-500' : 'bg-red-500',
                )}
              />
              {membership.isActive ? '활성' : '만료'}
            </span>
            <span>{membership.isActive ? '갱신일' : '만료일'}: {expiryDate}</span>
          </div>
        </div>

        {/* Manage button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="shrink-0 gap-1"
        >
          관리
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', isExpanded && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Expanded management section */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 px-4 py-4 space-y-3">
          {/* Tier verification status */}
          <div className="text-sm">
            <span className="text-muted-foreground">등급 인증: </span>
            <span className="font-medium">{TIER_LABELS[membership.tier]} 등급 인증 완료</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Melon linking */}
            {isMelonLinked ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <Music size={14} />
                멜론 연동 완료 ✓
              </span>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onMelonLink}
                disabled={isMelonLinking}
                className="gap-1.5"
              >
                {isMelonLinking ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    연동 중...
                  </>
                ) : (
                  <>
                    <Music size={14} />
                    멜론 연동
                  </>
                )}
              </Button>
            )}

            {/* Renewal button (expired only) */}
            {!membership.isActive && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw size={14} />
                갱신
              </Button>
            )}

            {/* Cancel button (active only) */}
            {membership.isActive && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isCancelling}
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isCancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    해지 중...
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    해지
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
