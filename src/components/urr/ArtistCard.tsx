import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { formatCompactNumber } from '@/lib/format'
import type { Artist } from '@/types'

interface ArtistCardProps {
  artist: Artist
  selected?: boolean
  variant?: 'default' | 'compact'
  onClick?: () => void
  className?: string
}

export function ArtistCard({ artist, selected = false, variant = 'default', onClick, className }: ArtistCardProps) {
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-lg border p-3 transition-all duration-150 cursor-pointer',
          selected ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-accent/50',
          className,
        )}
      >
        <div className="relative">
          {artist.avatar ? (
            <img src={artist.avatar} alt={artist.name} className="size-12 rounded-full shrink-0 object-cover" />
          ) : (
            <div className="size-12 rounded-full bg-muted shrink-0 flex items-center justify-center text-xs text-muted-foreground">
              {artist.name.charAt(0)}
            </div>
          )}
          {selected && (
            <div className="absolute -top-1 -right-1 size-5 rounded-full bg-primary flex items-center justify-center">
              <Check size={12} className="text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{artist.name}</p>
          <p className="text-xs text-muted-foreground">{`팔로워 ${formatCompactNumber(artist.followerCount)}`}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-3 rounded-lg border p-4 transition-all duration-150 cursor-pointer',
        selected ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-accent/50',
        className,
      )}
    >
      <div className="relative">
        {artist.avatar ? (
          <img src={artist.avatar} alt={artist.name} className="size-20 rounded-full object-cover" />
        ) : (
          <div className="size-20 rounded-full bg-muted flex items-center justify-center text-lg text-muted-foreground">
            {artist.name.charAt(0)}
          </div>
        )}
        {selected && (
          <div className="absolute -top-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center">
            <Check size={14} className="text-primary-foreground" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium transition-colors group-hover:text-primary">{artist.name}</p>
        <p className="text-xs text-muted-foreground">{`팔로워 ${formatCompactNumber(artist.followerCount)}`}</p>
      </div>
    </div>
  )
}
