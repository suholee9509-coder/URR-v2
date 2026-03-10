import { Heart, MessageCircle, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCompactNumber } from '@/lib/format'
import type { CommunityPost } from '@/data/mock-community'

interface PostCardProps {
  post: CommunityPost
  variant?: 'default' | 'compact'
  artistGradient?: string
}

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diff = now.getTime() - then.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}주 전`
  return `${Math.floor(days / 30)}개월 전`
}

export function PostCard({ post, variant = 'default', artistGradient }: PostCardProps) {
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card',
        isCompact ? 'p-4' : 'p-5',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* Author avatar */}
        {post.authorAvatar ? (
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className={cn(
              'shrink-0 rounded-full object-cover',
              isCompact ? 'size-8' : 'size-10',
            )}
          />
        ) : (
          <div
            className={cn(
              'shrink-0 rounded-full flex items-center justify-center text-white font-bold',
              isCompact ? 'size-8 text-xs' : 'size-10 text-sm',
            )}
            style={{
              background: artistGradient ?? 'linear-gradient(135deg, #374151, #6b7280)',
            }}
          >
            {post.authorName.charAt(0)}
          </div>
        )}

        {/* Author info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn('font-semibold truncate', isCompact ? 'text-xs' : 'text-sm')}>
              {post.authorName}
            </span>
            {post.isOfficial && (
              <BadgeCheck size={isCompact ? 12 : 14} className="text-primary fill-primary/20 shrink-0" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">{getRelativeTime(post.createdAt)}</span>
        </div>

      </div>

      {/* Content */}
      <p
        className={cn(
          'text-sm text-foreground/90 leading-relaxed mt-3',
          isCompact ? 'line-clamp-2' : 'line-clamp-4',
        )}
      >
        {post.content}
      </p>

      {/* Image gallery (default variant only) */}
      {!isCompact && post.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {post.images.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-lg overflow-hidden',
                post.images.length === 1 ? 'w-full aspect-[16/9]' : 'flex-1 aspect-[4/3]',
              )}
              style={{
                background: artistGradient ?? 'linear-gradient(135deg, #374151, #6b7280)',
                opacity: 0.7 + idx * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* Interaction bar */}
      <div
        className={cn(
          'flex items-center gap-5 text-muted-foreground',
          isCompact ? 'mt-2 text-xs' : 'mt-3 pt-3 border-t border-border text-sm',
        )}
      >
        <span className="flex items-center gap-1.5">
          <Heart size={isCompact ? 14 : 16} />
          {formatCompactNumber(post.likeCount)}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle size={isCompact ? 14 : 16} />
          {formatCompactNumber(post.commentCount)}
        </span>
      </div>
    </div>
  )
}
