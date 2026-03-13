import { MessageCircle } from 'lucide-react'
import { PostCard } from '@/components/urr/PostCard'
import { EmptyState } from '@/components/urr/EmptyState'
import { getArtistGradient } from '@/data/mock-home'
import type { CommunityPost } from '@/types'

interface ArtistCommunityTabProps {
  posts: CommunityPost[]
  artistId: string
}

export function ArtistCommunityTab({ posts, artistId }: ArtistCommunityTabProps) {
  if (posts.length === 0) {
    return <EmptyState icon={MessageCircle} description="등록된 소통 게시글이 없습니다" />
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
