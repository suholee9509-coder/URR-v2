import type { EventListItem } from '@/types'

// --- Asset imports (reuse existing posters) ---
import posterBTSYTC from '@/assets/event_bts-yet-to-come-in-cinema.png'
import posterBPBornPink from '@/assets/event_blackpink-born-pink.png'
import posterIVESWIA from '@/assets/event_ive-show-what-i-am.png'
import posterNJComplexcon from '@/assets/event_newjeans-complexcon.png'
import posterSVTBetheSun from '@/assets/event_seventeen-be-the-sun.png'
import posterSKZDomin from '@/assets/event_stray-kids-domin-world-tour.png'
import posterGIDLE from '@/assets/presale_gi-dle-world-tour.png'
import posterTXT from '@/assets/presale_txt-world-tour.png'
import posterNJFanmeet from '@/assets/presale_newjeans-fan-meeting.png'
import posterIVE1st from '@/assets/presale_ive-1st-world-tour.png'
import posterSVTFollow from '@/assets/presale_seventeen-follow-again-tour.png'
import posterSKZDominance from '@/assets/presale_straykids-dominance.png'

// --- Category filter options ---
export const eventCategoryFilters = [
  { value: 'all' as const, label: '전체' },
  { value: 'concert' as const, label: '콘서트' },
  { value: 'fanmeeting' as const, label: '팬미팅' },
  { value: 'domestic' as const, label: '내한공연' },
  { value: 'festival' as const, label: '페스티벌' },
  { value: 'musical' as const, label: '뮤지컬' },
  { value: 'etc' as const, label: '기타' },
]

export type EventCategoryFilter = (typeof eventCategoryFilters)[number]['value']

// --- Popular events (carousel) ---
export const popularEvents: EventListItem[] = [
  {
    id: 'evt-svt-bethesun-2026',
    artistId: 'seventeen',
    artistName: 'SEVENTEEN',
    title: 'SEVENTEEN WORLD TOUR BE THE SUN',
    venue: '인천 아시아드 주경기장',
    dateRange: '2026.04.04 - 2026.04.05',
    status: 'open',
    category: 'concert',
    tags: ['단독판매'],
    poster: posterSVTBetheSun,
  },
  {
    id: 'evt-bts-encore-2026',
    artistId: 'bts',
    artistName: 'BTS',
    title: 'BTS YET TO COME IN CINEMAS',
    venue: '잠실종합운동장 주경기장',
    dateRange: '2026.08.01 - 2026.08.03',
    status: 'open',
    category: 'concert',
    tags: ['단독판매'],
    poster: posterBTSYTC,
  },
  {
    id: 'evt-ive-show-2026',
    artistId: 'ive',
    artistName: 'IVE',
    title: 'IVE WORLD TOUR SHOW WHAT I AM',
    venue: 'KSPO DOME',
    dateRange: '2026.06.20 - 2026.06.22',
    status: 'open',
    category: 'concert',
    poster: posterIVESWIA,
  },
  {
    id: 'evt-blackpink-world-2026',
    artistId: 'blackpink',
    artistName: 'BLACKPINK',
    title: 'BLACKPINK BORN PINK WORLD TOUR',
    venue: '고척스카이돔',
    dateRange: '2026.07.15 - 2026.07.16',
    status: 'open',
    category: 'concert',
    tags: ['단독판매'],
    poster: posterBPBornPink,
  },
  {
    id: 'evt-nj-complexcon-2026',
    artistId: 'newjeans',
    artistName: 'NewJeans',
    title: 'NewJeans × COMPLEXCON',
    venue: 'Long Beach Convention Center',
    dateRange: '2026.05.10 - 2026.05.11',
    status: 'open',
    category: 'festival',
    poster: posterNJComplexcon,
  },
  {
    id: 'evt-skz-domtour-2026',
    artistId: 'skz',
    artistName: 'Stray Kids',
    title: 'Stray Kids DOMINANCE WORLD TOUR',
    venue: '고척스카이돔',
    dateRange: '2026.07.05 - 2026.07.06',
    status: 'open',
    category: 'concert',
    tags: ['단독판매'],
    poster: posterSKZDomin,
  },
]

// --- All events (grid) ---
export const allEventsData: EventListItem[] = [
  {
    id: 'evt-bts-encore-2026',
    artistId: 'bts',
    artistName: 'BTS',
    title: 'BTS YET TO COME IN CINEMAS',
    venue: '잠실종합운동장 주경기장',
    dateRange: '2026.08.01 - 2026.08.03',
    status: 'open',
    category: 'concert',
    poster: posterBTSYTC,
  },
  {
    id: 'evt-gidle-world-2026',
    artistId: 'gidle',
    artistName: '(G)I-DLE',
    title: "(G)I-DLE WORLD TOUR 'iDOL'",
    venue: 'KSPO DOME',
    dateRange: '2026.04.20 - 2026.04.21',
    status: 'open',
    category: 'concert',
    poster: posterGIDLE,
  },
  {
    id: 'evt-nj-complexcon-2026',
    artistId: 'newjeans',
    artistName: 'NewJeans',
    title: 'NewJeans × COMPLEXCON',
    venue: 'Long Beach Convention Center',
    dateRange: '2026.05.10 - 2026.05.11',
    status: 'open',
    category: 'festival',
    poster: posterNJComplexcon,
  },
  {
    id: 'evt-svt-follow-2026',
    artistId: 'seventeen',
    artistName: 'SEVENTEEN',
    title: 'SEVENTEEN FOLLOW AGAIN TOUR',
    venue: '인천 아시아드 주경기장',
    dateRange: '2026.05.25 - 2026.05.27',
    status: 'upcoming',
    category: 'concert',
    poster: posterSVTFollow,
  },
  {
    id: 'evt-skz-dominance-2026',
    artistId: 'skz',
    artistName: 'Stray Kids',
    title: 'Stray Kids DOMINANCE WORLD TOUR',
    venue: '고척스카이돔',
    dateRange: '2026.07.05 - 2026.07.06',
    status: 'open',
    category: 'concert',
    poster: posterSKZDominance,
  },
  {
    id: 'evt-txt-act-2026',
    artistId: 'txt',
    artistName: 'TXT',
    title: 'TXT WORLD TOUR ACT : PROMISE',
    venue: 'KSPO DOME',
    dateRange: '2026.06.10 - 2026.06.12',
    status: 'upcoming',
    category: 'concert',
    poster: posterTXT,
  },
  {
    id: 'evt-nj-fanmeet-2026',
    artistId: 'newjeans',
    artistName: 'NewJeans',
    title: "NewJeans Fan Meeting 'Bunnies Camp'",
    venue: '올림픽공원 올림픽홀',
    dateRange: '2026.03.15 - 2026.03.16',
    status: 'open',
    category: 'fanmeeting',
    poster: posterNJFanmeet,
  },
  {
    id: 'evt-ive-1st-2026',
    artistId: 'ive',
    artistName: 'IVE',
    title: 'IVE THE 1ST WORLD TOUR',
    venue: 'KSPO DOME',
    dateRange: '2026.04.12 - 2026.04.13',
    status: 'open',
    category: 'concert',
    poster: posterIVE1st,
  },
  {
    id: 'evt-blackpink-world-2026',
    artistId: 'blackpink',
    artistName: 'BLACKPINK',
    title: 'BLACKPINK BORN PINK WORLD TOUR',
    venue: '고척스카이돔',
    dateRange: '2026.07.15 - 2026.07.16',
    status: 'open',
    category: 'concert',
    poster: posterBPBornPink,
  },
  {
    id: 'evt-svt-bethesun-2026',
    artistId: 'seventeen',
    artistName: 'SEVENTEEN',
    title: 'SEVENTEEN WORLD TOUR BE THE SUN',
    venue: '인천 아시아드 주경기장',
    dateRange: '2026.04.04 - 2026.04.05',
    status: 'open',
    category: 'concert',
    poster: posterSVTBetheSun,
  },
]
