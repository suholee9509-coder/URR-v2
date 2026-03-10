import { cn } from '@/lib/utils'
import { getArtistGradient } from '@/data/mock-home'

const sizeStyles = {
  xs: 'size-8 text-[10px]',
  sm: 'size-10 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-base',
  xl: 'size-20 text-lg',
}

interface GradientAvatarProps {
  src?: string
  name: string
  artistId: string
  size?: keyof typeof sizeStyles
  className?: string
}

export function GradientAvatar({
  src,
  name,
  artistId,
  size = 'sm',
  className,
}: GradientAvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full shrink-0 object-cover', sizeStyles[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full shrink-0 flex items-center justify-center text-white font-medium',
        sizeStyles[size],
        className,
      )}
      style={{ background: getArtistGradient(artistId) }}
    >
      {name.charAt(0)}
    </div>
  )
}
