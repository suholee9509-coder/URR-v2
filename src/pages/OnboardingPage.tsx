import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthStep } from '@/components/onboarding/AuthStep'
import { IdentityStep } from '@/components/onboarding/IdentityStep'
import { SignupCompleteStep } from '@/components/onboarding/SignupCompleteStep'
import { OnboardingHero } from '@/components/onboarding/OnboardingHero'

type FlowState = 'auth' | 'identity' | 'complete'
type AuthProvider = 'kakao' | 'naver' | 'email'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [flowState, setFlowState] = useState<FlowState>('auth')
  const [userName, setUserName] = useState('')

  // Step 1: Auth (social or email)
  const handleAuthComplete = useCallback(
    (data: { provider: AuthProvider; email?: string; password?: string; mode?: 'login' | 'register' }) => {
      // 이메일 로그인 → 바로 홈
      if (data.provider === 'email' && data.mode === 'login') {
        navigate('/')
        return
      }

      // 회원가입 (소셜 첫 가입 or 이메일 회원가입) → 본인인증 단계로
      setFlowState('identity')
    },
    [navigate],
  )

  // Step 2: Identity verification complete → 가입 완료 화면
  const handleIdentityComplete = useCallback(
    (data: { userName: string; phoneNumber: string; birthDate: string; gender: 'male' | 'female' }) => {
      setUserName(data.userName)
      setFlowState('complete')
    },
    [],
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
