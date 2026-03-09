import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getArtistById } from '@/data/mock-artists'
import { mockUser } from '@/data/mock-user'
import {
  getArtistExtendedInfo,
  getEventsByArtistId,
  categorizeEvents,
  getTransferListingsWithEvent,
} from '@/data/mock-artist-page'
import { getCommunityPostsByArtistId } from '@/data/mock-community'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArtistHeader } from '@/components/artist/ArtistHeader'
import { ArtistHomeTab } from '@/components/artist/ArtistHomeTab'
import { ArtistCommunityTab } from '@/components/artist/ArtistCommunityTab'
import { ArtistEventsTab } from '@/components/artist/ArtistEventsTab'
import { ArtistTransferTab } from '@/components/artist/ArtistTransferTab'
import { ArtistPageSkeleton } from '@/components/artist/ArtistPageSkeleton'
import { MembershipGate } from '@/components/artist/MembershipGate'

export default function ArtistPage() {
  const { artistId } = useParams<{ artistId: string }>()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  // Derive active tab from URL
  const activeTab = pathname.endsWith('/community')
    ? 'community'
    : pathname.endsWith('/events')
      ? 'events'
      : pathname.endsWith('/transfers')
        ? 'transfers'
        : 'home'

  const handleTabChange = (value: string) => {
    const base = `/artists/${artistId}`
    navigate(value === 'home' ? base : `${base}/${value}`)
  }

  // Reset loading & follow state when artist changes
  useEffect(() => {
    setIsLoading(true)
    setFollowing(mockUser.followedArtistIds.includes(artistId ?? ''))
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [artistId])

  if (isLoading) return <ArtistPageSkeleton />

  const artist = artistId ? getArtistById(artistId) : undefined

  if (!artist) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">아티스트를 찾을 수 없습니다</p>
        <p className="text-sm text-muted-foreground">잘못된 경로이거나 삭제된 아티스트입니다.</p>
      </div>
    )
  }

  const membership = mockUser.memberships.find((m) => m.artistId === artistId)
  const extendedInfo = getArtistExtendedInfo(artist.id)
  const allEvents = getEventsByArtistId(artist.id)
  const { upcoming, past } = categorizeEvents(allEvents)
  const nextEvent = upcoming[0]
  const transferListings = getTransferListingsWithEvent(artist.id)
  const communityPosts = getCommunityPostsByArtistId(artist.id)

  return (
    <div>
      <ArtistHeader
        artist={artist}
        membership={membership}
        isFollowing={following}
        onFollowToggle={() => setFollowing((prev) => !prev)}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line" className="w-full justify-start mt-8 border-b border-border">
          <TabsTrigger value="home" className="flex-none">홈</TabsTrigger>
          <TabsTrigger value="community" className="flex-none">소통</TabsTrigger>
          <TabsTrigger value="events" className="flex-none">공연</TabsTrigger>
          <TabsTrigger value="transfers" className="flex-none">양도</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="pt-8">
          <ArtistHomeTab
            artist={artist}
            extendedInfo={extendedInfo}
            nextEvent={nextEvent}
            upcomingEvents={upcoming}
            pastEvents={past}
            transferListings={transferListings}
            communityPosts={communityPosts}
            membership={membership}
            onNavigateTab={handleTabChange}
          />
        </TabsContent>

        <TabsContent value="community" className="pt-6">
          {membership ? (
            <ArtistCommunityTab posts={communityPosts} artistId={artist.id} />
          ) : (
            <MembershipGate artistId={artist.id} artistName={artist.name} />
          )}
        </TabsContent>

        <TabsContent value="events" className="pt-6">
          <ArtistEventsTab
            upcoming={upcoming}
            past={past}
            artistName={artist.name}
          />
        </TabsContent>

        <TabsContent value="transfers" className="pt-6">
          {membership ? (
            <ArtistTransferTab
              listings={transferListings}
              events={allEvents}
              membership={membership}
              artistId={artist.id}
            />
          ) : (
            <MembershipGate artistId={artist.id} artistName={artist.name} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
