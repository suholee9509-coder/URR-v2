import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthStep } from '@/components/onboarding/AuthStep'
import { IdentityStep } from '@/components/onboarding/IdentityStep'
import { OnboardingHero } from '@/components/onboarding/OnboardingHero'

type FlowState = 'auth' | 'identity' | 'done'
type AuthProvider = 'kakao' | 'naver' | 'email'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [flowState, setFlowState] = useState<FlowState>('auth')
  const [, setAuthProvider] = useState<AuthProvider | null>(null)
  const [, setEmailData] = useState<{ email: string; password: string } | null>(null)

  // Step 1: Auth (social or email) → mock API call
  const handleAuthComplete = useCallback(
    (data: { provider: AuthProvider; email?: string; password?: string; mode?: 'login' | 'register' }) => {
      setAuthProvider(data.provider)
      if (data.provider === 'email') {
        setEmailData({ email: data.email!, password: data.password! })
      }

      // Social login → always treat as existing user (mock)
      if (data.provider !== 'email') {
        navigate('/')
        return
      }

      // Email login → redirect home (existing user)
      if (data.mode === 'login') {
        navigate('/')
        return
      }

      // Email register → go to identity verification
      setFlowState('identity')
    },
    [navigate],
  )

  // Step 2: Identity verification complete → signup done → redirect
  const handleIdentityComplete = useCallback(
    (_data: { userName: string; phoneNumber: string; birthDate: string; gender: 'male' | 'female' }) => {
      // Mock: create account with authProvider + identity data + email data
      navigate('/')
    },
    [navigate],
  )

  const heroStep = flowState === 'auth' ? 1 : 2

  return (
    <div className="flex h-screen">
      {/* Left: Form panel */}
      <div className="w-1/2 h-full overflow-y-auto flex flex-col items-center justify-center px-8 py-16">
        <div key={flowState} className="w-full flex justify-center animate-in fade-in duration-300">
          {flowState === 'auth' && <AuthStep onComplete={handleAuthComplete} />}
          {flowState === 'identity' && (
            <IdentityStep
              onComplete={handleIdentityComplete}
              onBack={() => setFlowState('auth')}
            />
          )}
        </div>
      </div>

      {/* Right: Marketing hero panel */}
      <div className="w-1/2 h-full">
        <OnboardingHero step={heroStep} />
      </div>
    </div>
  )
}
