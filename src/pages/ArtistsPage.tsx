import { useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollableRow } from '@/components/common/ScrollableRow'
import { FilterChip } from '@/components/urr'
import {
  homePopularArtists,
  getArtistGradient,
  featuredArtists,
  newArtistCards,
} from '@/data/mock-home'
import type { FeaturedArtist } from '@/data/mock-home'

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */

function formatFollowerShort(count: number): string {
  const man = count / 10000
  if (man >= 1) {
    const formatted = man % 1 === 0 ? man.toFixed(0) : man.toFixed(1).replace(/\.0$/, '')
    return `${formatted}만`
  }
  return count.toLocaleString()
}

/* ------------------------------------------------------------------ */
/*  badge color by label                                              */
/* ------------------------------------------------------------------ */

const labelBadgeStyle: Record<string, string> = {
  '신인상 수상': 'bg-white border-border text-destructive',
  '컴백 확정': 'bg-white border-border text-secondary',
  '단독 콘서트': 'bg-white border-border text-primary',
}

function getBadgeStyle(label: string) {
  return labelBadgeStyle[label] ?? 'bg-white border-border text-foreground'
}

/* ------------------------------------------------------------------ */
/*  category filter options                                           */
/* ------------------------------------------------------------------ */

const categoryFilters = [
  { value: 'all', label: '전체' },
  { value: 'group', label: '그룹' },
  { value: 'solo', label: '솔로' },
  { value: 'new', label: 'NEW' },
] as const

type CategoryFilter = (typeof categoryFilters)[number]['value']

/* ------------------------------------------------------------------ */
/*  main                                                              */
/* ------------------------------------------------------------------ */

export default function ArtistsPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<CategoryFilter>('all')

  // filtered featured artists (category only)
  const filteredFeatured = useMemo(() => {
    let list: FeaturedArtist[] = featuredArtists
    if (category !== 'all') list = list.filter((a) => a.category === category)
    return list
  }, [category])

  // set of known artist IDs for routing
  const knownArtistIds = useMemo(
    () => new Set(homePopularArtists.map((a) => a.id)),
    [],
  )

  // resolve featured artist link: strip suffixes like "-feat", "-2" to find base ID
  const getArtistLink = useCallback(
    (id: string) => {
      if (knownArtistIds.has(id)) return `/artists/${id}`
      const baseId = id.replace(/-(feat|2|3)$/, '')
      if (knownArtistIds.has(baseId)) return `/artists/${baseId}`
      return '/artists'
    },
    [knownArtistIds],
  )

  // ranked artists (sorted by followers desc)
  const rankedArtists = homePopularArtists

  return (
    <div className="space-y-16">
      {/* ===== 1. 추천 아티스트 ===== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">추천 아티스트</h2>
          <FilterChip options={categoryFilters} value={category} onChange={setCategory} />
        </div>

        <ScrollableRow className="flex gap-3">
          {filteredFeatured.map((artist) => (
            <Link
              key={artist.id}
              to={getArtistLink(artist.id)}
              className="group shrink-0 w-[125px]"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{artist.name}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Users size={11} />
                  {formatFollowerShort(artist.followerCount)}
                </p>
              </div>
            </Link>
          ))}
        </ScrollableRow>
        {filteredFeatured.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">해당 카테고리에 추천 아티스트가 없습니다.</div>
        )}
      </section>

      {/* ===== 2. 주목할 만한 NEW 아티스트 ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">주목할 만한 NEW 아티스트</h2>
        <ScrollableRow className="flex gap-4">
          {newArtistCards.map((card) => (
            <div
              key={card.id}
              className="rounded-xl bg-[#F9F8F5] hover:bg-[#F3F2ED] transition-colors px-5 pt-3 pb-4 flex flex-col shrink-0 w-[440px]"
            >
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border self-start mb-2', getBadgeStyle(card.label))}>
                {card.label}
              </span>
              <div className="flex gap-3">
                {/* Square profile image */}
                <div className="w-[110px] h-[110px] rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src={card.profileImage}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Text + Buttons */}
                <div className="flex-1 min-w-0 flex flex-col h-[110px]">
                  <h3 className="text-[15px] font-semibold line-clamp-2 leading-snug">{card.title}</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{card.description}</p>
                  <div className="flex gap-1.5 mt-auto">
                    <button
                      onClick={() => navigate(`/membership?artistId=${card.id}`)}
                      className="px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
                    >
                      멤버십 가입
                    </button>
                    <button
                      onClick={() => navigate(`/artists/${card.id}`)}
                      className="px-3 py-1 rounded-full border border-border text-[11px] font-medium hover:bg-accent transition-colors cursor-pointer"
                    >
                      아티스트 홈
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollableRow>
      </section>

      {/* ===== 3. 팔로워 랭킹순 ===== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">팔로워 랭킹순</h2>
          <span className="text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5">
            이번 주
          </span>
        </div>
        <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-8 gap-y-0">
          {rankedArtists.map((artist, index) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="group flex items-center gap-3 py-3 border-b border-border hover:bg-[#F6F5EE] transition-colors rounded-sm px-1 -mx-1"
            >
              {/* Rank number */}
              <span className="text-sm font-bold text-foreground w-5 text-center shrink-0">
                {index + 1}
              </span>
              {/* Artist avatar (circle) */}
              {artist.avatar ? (
                <img src={artist.avatar} alt={artist.name} className="size-10 rounded-full shrink-0 object-cover" />
              ) : (
                <div
                  className="size-10 rounded-full shrink-0 flex items-center justify-center text-xs text-white font-medium"
                  style={{ background: getArtistGradient(artist.id) }}
                >
                  {artist.name.charAt(0)}
                </div>
              )}
              {/* Artist info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{artist.name}</p>
                <p className="text-xs text-muted-foreground truncate">{artist.bio}</p>
              </div>
              {/* Follower count (separate column) */}
              <div className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={12} />
                {formatFollowerShort(artist.followerCount)}
              </div>
              {/* Membership button (black, rounded-full) */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/membership?artistId=${artist.id}`) }}
                className="shrink-0 px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
              >
                멤버십 가입
              </button>
            </Link>
          ))}
        </div>
        {rankedArtists.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">검색 결과가 없습니다.</div>
        )}
      </section>
    </div>
  )
}
