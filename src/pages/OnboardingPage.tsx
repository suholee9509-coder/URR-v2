import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthStep } from '@/components/onboarding/AuthStep'
import { AgeGateStep } from '@/components/onboarding/AgeGateStep'
import { IdentityStep } from '@/components/onboarding/IdentityStep'
import { GuardianIdentityStep } from '@/components/onboarding/GuardianIdentityStep'
import { TermsStep } from '@/components/onboarding/TermsStep'
import { SignupCompleteStep } from '@/components/onboarding/SignupCompleteStep'
import { OnboardingHero } from '@/components/onboarding/OnboardingHero'

type FlowState = 'auth' | 'age-gate' | 'identity' | 'guardian-identity' | 'terms' | 'complete'
type AuthProvider = 'kakao' | 'naver' | 'email'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [flowState, setFlowState] = useState<FlowState>('auth')
  const [userName, setUserName] = useState('')
  const [isMinor, setIsMinor] = useState(false)

  // Step 1: Auth
  const handleAuthComplete = useCallback(
    (data: { provider: AuthProvider; email?: string; password?: string; mode?: 'login' | 'register' }) => {
      if (data.provider === 'email' && data.mode === 'login') {
        navigate('/')
        return
      }
      setFlowState('age-gate')
    },
    [navigate],
  )

  // Step 2: AgeGate
  const handleAdult = useCallback(() => {
    setIsMinor(false)
    setFlowState('identity')
  }, [])

  const handleMinor = useCallback(() => {
    setIsMinor(true)
    setFlowState('guardian-identity')
  }, [])

  // Step 3a: 본인인증 완료
  const handleIdentityComplete = useCallback(
    (data: { userName: string; phoneNumber: string; birthDate: string; gender: 'male' | 'female' }) => {
      setUserName(data.userName)
      setFlowState('terms')
    },
    [],
  )

  // Step 3b: 보호자 인증 완료
  const handleGuardianComplete = useCallback(
    (_data: { guardianName: string; guardianPhone: string; birthDate: string; gender: 'male' | 'female' }) => {
      setFlowState('terms')
    },
    [],
  )

  // Step 4: 약관 동의 완료
  const handleTermsComplete = useCallback(() => {
    setFlowState('complete')
  }, [])

  // Hero 패널 단계 매핑
  const heroStep =
    flowState === 'auth' ? 1
    : flowState === 'age-gate' ? 2
    : flowState === 'identity' ? 2
    : flowState === 'guardian-identity' ? 2
    : flowState === 'complete' ? 5
    : 3 // terms

  return (
    <div className="flex h-screen">
      {/* Left: Form panel */}
      <div className="w-1/2 h-full overflow-y-auto flex flex-col items-center justify-center px-8 py-16">
        <div key={flowState} className="w-full flex justify-center animate-in fade-in duration-300">
          {flowState === 'auth' && <AuthStep onComplete={handleAuthComplete} />}
          {flowState === 'age-gate' && (
            <AgeGateStep
              onAdult={handleAdult}
              onMinor={handleMinor}
              onBack={() => setFlowState('auth')}
            />
          )}
          {flowState === 'identity' && (
            <IdentityStep
              onComplete={handleIdentityComplete}
              onBack={() => setFlowState('age-gate')}
            />
          )}
          {flowState === 'guardian-identity' && (
            <GuardianIdentityStep
              onComplete={handleGuardianComplete}
              onBack={() => setFlowState('age-gate')}
            />
          )}
          {flowState === 'terms' && (
            <TermsStep
              onComplete={handleTermsComplete}
              onBack={() => setFlowState(isMinor ? 'guardian-identity' : 'identity')}
              isMinor={isMinor}
            />
          )}
          {flowState === 'complete' && <SignupCompleteStep userName={userName} />}
        </div>
      </div>

      {/* Right: Marketing hero panel */}
      <div className="w-1/2 h-full">
        <OnboardingHero step={heroStep} />
      </div>
    </div>
  )
}
