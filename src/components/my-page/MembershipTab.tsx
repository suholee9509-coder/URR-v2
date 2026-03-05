import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MembershipCard } from './MembershipCard'
import { MembershipCancelDialog } from './MembershipCancelDialog'
import type { Membership } from '@/types'

interface MembershipTabProps {
  memberships: Membership[]
  onCancelMembership: (membershipId: string) => void
}

export function MembershipTab({ memberships, onCancelMembership }: MembershipTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [melonLinkedMap, setMelonLinkedMap] = useState<Record<string, boolean>>({})
  const [linkingId, setLinkingId] = useState<string | null>(null)

  // Cancel flow state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleMelonLink = (membershipId: string) => {
    setLinkingId(membershipId)
    setTimeout(() => {
      setMelonLinkedMap((prev) => ({ ...prev, [membershipId]: true }))
      setLinkingId(null)
    }, 1000)
  }

  const handleCancelRequest = (membershipId: string) => {
    setCancelTargetId(membershipId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = (_reason: string) => {
    if (!cancelTargetId) return
    setIsCancelling(true)
    setTimeout(() => {
      onCancelMembership(cancelTargetId)
      setIsCancelling(false)
      setCancelDialogOpen(false)
      setCancelTargetId(null)
    }, 1000)
  }

  const cancelTarget = memberships.find((m) => m.id === cancelTargetId)

  if (memberships.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
          <Users size={24} className="text-muted-foreground" />
        </div>
        <p className="text-base font-medium">가입한 멤버십이 없습니다.</p>
        <p className="text-sm text-muted-foreground">
          아티스트 페이지에서 멤버십에 가입하세요!
        </p>
        <Button asChild className="mt-2">
          <Link to="/artists">아티스트 찾기</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {memberships.map((m) => (
          <MembershipCard
            key={m.id}
            membership={m}
            isExpanded={expandedId === m.id}
            onToggle={() => handleToggle(m.id)}
            isMelonLinked={melonLinkedMap[m.id] ?? false}
            isMelonLinking={linkingId === m.id}
            onMelonLink={() => handleMelonLink(m.id)}
            onCancel={() => handleCancelRequest(m.id)}
            isCancelling={isCancelling && cancelTargetId === m.id}
          />
        ))}
      </div>

      <MembershipCancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        artistName={cancelTarget?.artistName ?? ''}
        onConfirm={handleCancelConfirm}
        isProcessing={isCancelling}
      />
    </>
  )
}
