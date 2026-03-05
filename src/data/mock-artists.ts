import type { Artist } from '@/types'
import avatarGDragon from '@/assets/Artist_G-Dragon.png'
import avatarBTS from '@/assets/Artist_BTS.png'
import avatarAespa from '@/assets/Artist_aespa.png'
import avatarIVE from '@/assets/Artist_IVE.png'
import avatarBlackpink from '@/assets/Artist_Blackpink.png'

export const mockArtists: Artist[] = [
  {
    id: 'gdragon',
    name: 'G-Dragon',
    avatar: avatarGDragon,
    banner: '',
    bio: 'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.',
    followerCount: 2450000,
    category: 'solo',
  },
  {
    id: 'bts',
    name: 'BTS',
    avatar: avatarBTS,
    banner: '',
    bio: '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.',
    followerCount: 8900000,
    category: 'boygroup',
  },
  {
    id: 'aespa',
    name: 'aespa',
    avatar: avatarAespa,
    banner: '',
    bio: 'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.',
    followerCount: 3200000,
    category: 'girlgroup',
  },
  {
    id: 'ive',
    name: 'IVE',
    avatar: avatarIVE,
    banner: '',
    bio: 'Starship Entertainment 6인조 걸그룹. "나"를 당당하게 표현하는 음악.',
    followerCount: 2100000,
    category: 'girlgroup',
  },
  {
    id: 'blackpink',
    name: 'BLACKPINK',
    avatar: avatarBlackpink,
    banner: '',
    bio: 'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.',
    followerCount: 7500000,
    category: 'girlgroup',
  },
]

export function getArtistById(id: string): Artist | undefined {
  return mockArtists.find(a => a.id === id)
}
