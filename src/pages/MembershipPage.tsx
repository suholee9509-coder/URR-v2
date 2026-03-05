import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArtistSelectStep } from '@/components/membership/ArtistSelectStep'
import { MembershipIntroStep } from '@/components/membership/MembershipIntroStep'
import { MembershipPaymentStep } from '@/components/membership/MembershipPaymentStep'
import { MembershipCompleteStep } from '@/components/membership/MembershipCompleteStep'
import { mockUser } from '@/data/mock-user'
import { mockArtists } from '@/data/mock-artists'
import type { Artist } from '@/types'

type Step = 'select' | 'intro' | 'payment' | 'complete'

export default function MembershipPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<Step>('select')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)

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

  // Get followed artists
  const followedArtists = mockUser.followedArtistIds
    .map((id) => mockArtists.find((a) => a.id === id))
    .filter(Boolean) as typeof mockArtists

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
          artists={followedArtists}
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
          onComplete={() => setStep('complete')}
        />
      )}

      {step === 'complete' && selectedArtist && (
        <MembershipCompleteStep artist={selectedArtist} />
      )}
    </div>
  )
}
