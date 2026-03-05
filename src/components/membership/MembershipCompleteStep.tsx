import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartyPopper, Music2, Loader2, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TierBadge } from '@/components/urr/TierBadge'
import type { Artist } from '@/types'

interface MembershipCompleteStepProps {
  artist: Artist
}

type MelonState = 'idle' | 'linking' | 'done'

export function MembershipCompleteStep({ artist }: MembershipCompleteStepProps) {
  const navigate = useNavigate()
  const [melonState, setMelonState] = useState<MelonState>('idle')

  const handleMelonLink = () => {
    setMelonState('linking')
    setTimeout(() => {
      setMelonState('done')
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-8">
      {/* Celebration */}
      <div className="space-y-4">
        <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <PartyPopper size={28} className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">멤버십 가입 완료!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {artist.name} 멤버십에 성공적으로 가입되었습니다
          </p>
        </div>
      </div>

      {/* Membership card */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 justify-center">
          <Avatar className="size-10">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback className="text-sm font-bold bg-muted">
              {artist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold">{artist.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TierBadge tier="bronze" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Melon integration */}
      <div className="w-full max-w-sm rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-5 space-y-4">
        {melonState === 'idle' && (
          <>
            <div className="flex items-center gap-2 justify-center">
              <Music2 size={18} className="text-primary" />
              <p className="text-sm font-semibold">멜론 연동으로 등급 UP!</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              멜론 스트리밍 데이터를 연동하면 청취량에 따라 더 높은 등급을 받을 수 있습니다
            </p>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={handleMelonLink} className="gap-1.5">
                <Music2 size={14} />
                멜론 연동하기
              </Button>
              <button
                onClick={() => navigate(`/artists/${artist.id}`)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                나중에 하기
              </button>
            </div>
          </>
        )}

        {melonState === 'linking' && (
          <div className="flex flex-col items-center gap-3 py-2">
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">멜론 데이터 확인 중...</p>
          </div>
        )}

        {melonState === 'done' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center text-green-600">
              <CheckCircle2 size={18} />
              <p className="text-sm font-semibold">연동 완료!</p>
            </div>
            <p className="text-xs text-muted-foreground">
              멜론 청취 데이터 기반으로 등급이 확인되었습니다
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5">
                <TierBadge tier="bronze" size="sm" />
                <span className="text-xs text-muted-foreground">→</span>
                <TierBadge tier="gold" size="sm" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate(`/artists/${artist.id}`)}>
          아티스트 페이지로 이동
        </Button>
        <Button variant="ghost" onClick={() => navigate('/')}>
          홈으로
        </Button>
      </div>
    </div>
  )
}
