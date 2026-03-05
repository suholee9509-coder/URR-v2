import { MessageCircle } from 'lucide-react'
import { PostCard } from '@/components/urr/PostCard'
import { getArtistGradient } from '@/data/mock-home'
import type { CommunityPost } from '@/data/mock-community'

interface ArtistCommunityTabProps {
  posts: CommunityPost[]
  artistId: string
}

export function ArtistCommunityTab({ posts, artistId }: ArtistCommunityTabProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <MessageCircle size={40} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">등록된 소통 게시글이 없습니다</p>
      </div>
    )
  }

  const sorted = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const gradient = getArtistGradient(artistId)

  return (
    <div className="space-y-4">
      {sorted.map((post) => (
        <PostCard key={post.id} post={post} artistGradient={gradient} />
      ))}
    </div>
  )
}
