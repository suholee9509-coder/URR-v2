import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MembershipGateProps {
  artistId: string
  artistName: string
}

export function MembershipGate({ artistId, artistName }: MembershipGateProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      {/* Icon */}
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Crown size={28} className="text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground">멤버십 회원 전용</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mt-2 text-center leading-relaxed max-w-[320px]">
        {artistName} 멤버십에 가입하여
        <br />
        다양한 독점 콘텐츠와 혜택을 누려보세요
      </p>

      {/* CTA */}
      <Button
        className="mt-6"
        onClick={() => navigate(`/membership?artistId=${artistId}`)}
      >
        멤버십 가입하기
      </Button>
    </div>
  )
}
