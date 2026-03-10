import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArtistSelectStep } from '@/components/membership/ArtistSelectStep'
import { MembershipIntroStep } from '@/components/membership/MembershipIntroStep'
import { MembershipPaymentStep } from '@/components/membership/MembershipPaymentStep'
import { MembershipProfileStep } from '@/components/membership/MembershipProfileStep'
import { MembershipCompleteStep } from '@/components/membership/MembershipCompleteStep'
import { mockUser } from '@/data/mock-user'
import { mockArtists } from '@/data/mock-artists'
import type { Artist, TierLevel } from '@/types'

type Step = 'select' | 'intro' | 'payment' | 'profile' | 'complete'

export default function MembershipPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<Step>('select')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [profileData, setProfileData] = useState<{ nickname: string; tier: TierLevel } | null>(null)

  // If artistId is provided via query param, skip to intro step
  useEffect(() => {
    const artistId = searchParams.get('artistId')
    if (artistId) {
      const artist = mockArtists.find((a) => a.id === artistId)
      if (artist) {
        setSelectedArtist(artist)
        setStep('intro')
      }
    }
  }, [searchParams])

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist)
    setStep('intro')
  }

  const handleBack = () => {
    if (step === 'intro') {
      // If came from artist page (query param), go back to select anyway
      setStep('select')
      setSelectedArtist(null)
    } else if (step === 'payment') {
      setStep('intro')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {step === 'select' && (
        <ArtistSelectStep
          artists={mockArtists}
          memberships={mockUser.memberships}
          onSelect={handleSelectArtist}
        />
      )}

      {step === 'intro' && selectedArtist && (
        <MembershipIntroStep
          artist={selectedArtist}
          onBack={handleBack}
          onSubscribe={() => setStep('payment')}
        />
      )}

      {step === 'payment' && selectedArtist && (
        <MembershipPaymentStep
          artist={selectedArtist}
          onBack={handleBack}
          onComplete={() => setStep('profile')}
        />
      )}

      {step === 'profile' && selectedArtist && (
        <MembershipProfileStep
          artist={selectedArtist}
          onComplete={(data) => {
            setProfileData({ nickname: data.nickname, tier: data.tier })
            setStep('complete')
          }}
        />
      )}

      {step === 'complete' && selectedArtist && (
        <MembershipCompleteStep
          artist={selectedArtist}
          nickname={profileData?.nickname ?? ''}
          tier={profileData?.tier ?? 'cloud'}
        />
      )}
    </div>
  )
}
