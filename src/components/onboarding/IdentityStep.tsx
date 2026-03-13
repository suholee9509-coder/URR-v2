import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatTimer } from '@/lib/format'

type VerificationState = 'idle' | 'sent' | 'expired' | 'verifying' | 'duplicate'

interface IdentityStepProps {
  onComplete: (data: {
    userName: string
    phoneNumber: string
    birthDate: string
    gender: 'male' | 'female'
  }) => void
  onBack: () => void
}

function isUnder14(dobStr: string): boolean {
  if (dobStr.length !== 8) return false
  const year = parseInt(dobStr.slice(0, 4), 10)
  const month = parseInt(dobStr.slice(4, 6), 10)
  const day = parseInt(dobStr.slice(6, 8), 10)
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false
  const birth = new Date(year, month - 1, day)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age < 14
}

export function IdentityStep({ onComplete, onBack }: IdentityStepProps) {
  const navigate = useNavigate()
  const [carrier, setCarrier] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [nationality, setNationality] = useState<'domestic' | 'foreign' | null>(null)
  const [phone, setPhone] = useState('')

  const [verificationState, setVerificationState] = useState<VerificationState>('idle')
  const [code, setCode] = useState('')
  const [timerSeconds, setTimerSeconds] = useState(180)

  const isMinor = isUnder14(dob)

  useEffect(() => {
    if (verificationState !== 'sent') return
    if (timerSeconds <= 0) {
      setVerificationState('expired')
      return
    }
    const id = setInterval(() => {
      setTimerSeconds((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [verificationState, timerSeconds])

  const canSendCode = phone.length >= 10 && carrier && name.trim() && dob.length === 8 && gender !== null && nationality !== null && !isMinor

  const handleSendCode = () => {
    setVerificationState('sent')
    setTimerSeconds(180)
    setCode('')
  }

  const handleResend = () => {
    setTimerSeconds(180)
    setVerificationState('sent')
    setCode('')
  }

  const handleVerify = () => {
    if (code.length !== 6) return
    setVerificationState('verifying')
    setTimeout(() => {
      // Mock CI 중복 체크: 01099999999 → 기존 계정 존재
      if (phone === '01099999999') {
        setVerificationState('duplicate')
        setTimeout(() => {
          navigate('/')
        }, 1500)
        return
      }
      onComplete({
        userName: name,
        phoneNumber: phone,
        birthDate: dob,
        gender: gender!,
      })
    }, 1000)
  }

  const isCodeValid = verificationState === 'sent' && code.length === 6

  return (
    <div className="max-w-[480px] w-full mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        로그인으로 돌아가기
      </button>

      <h1 className="text-2xl font-bold">본인 인증</h1>
      <p className="text-sm text-muted-foreground mt-2">
        1인 1계정 인증으로 봇과 매크로를 방지합니다.
      </p>

      <div className="mt-8 space-y-4">
        {/* Carrier */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">통신사</label>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="통신사 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skt">SKT</SelectItem>
              <SelectItem value="kt">KT</SelectItem>
              <SelectItem value="lgu">LGU+</SelectItem>
              <SelectItem value="mvno">알뜰폰</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">이름</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="실명 입력"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">생년월일</label>
          <Input
            value={dob}
            onChange={(e) => setDob(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="YYYYMMDD"
            maxLength={8}
            inputMode="numeric"
            className={isMinor ? 'border-destructive focus-visible:ring-destructive/30' : ''}
          />
          {isMinor && (
            <p className="text-xs text-destructive mt-1.5">만 14세 미만은 가입할 수 없습니다</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">성별</label>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button
              type="button"
              className={cn(
                'flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                gender === 'male' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent',
              )}
              onClick={() => setGender('male')}
            >
              남성
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 py-2.5 text-sm font-medium transition-colors border-l border-input cursor-pointer',
                gender === 'female' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent',
              )}
              onClick={() => setGender('female')}
            >
              여성
            </button>
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">내/외국인</label>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button
              type="button"
              className={cn(
                'flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                nationality === 'domestic' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent',
              )}
              onClick={() => setNationality('domestic')}
            >
              내국인
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 py-2.5 text-sm font-medium transition-colors border-l border-input cursor-pointer',
                nationality === 'foreign' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent',
              )}
              onClick={() => setNationality('foreign')}
            >
              외국인
            </button>
          </div>
        </div>

        {/* Phone + Send code */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">휴대폰 번호</label>
          <div className="flex gap-2">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="01012345678"
              inputMode="numeric"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={verificationState === 'expired' ? handleResend : handleSendCode}
              disabled={!canSendCode || verificationState === 'verifying'}
              className="shrink-0"
            >
              {verificationState === 'idle' ? '인증번호 발송' : '재발송'}
            </Button>
          </div>
        </div>

        {/* Verification code section */}
        {verificationState !== 'idle' && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">인증번호</label>
              <div className="flex items-center gap-3">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6자리 입력"
                  maxLength={6}
                  inputMode="numeric"
                  disabled={verificationState === 'expired' || verificationState === 'verifying'}
                  className="font-mono tracking-[0.3em] text-center"
                />
                <span
                  className={cn(
                    'font-mono text-sm shrink-0 w-12 text-right',
                    timerSeconds <= 30 ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            {verificationState === 'expired' && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-destructive">인증 시간이 만료되었습니다.</p>
                <Button variant="ghost" size="sm" onClick={handleResend}>
                  재발송
                </Button>
              </div>
            )}

            {verificationState === 'duplicate' && (
              <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 space-y-1">
                <p className="text-sm font-medium text-primary">이미 가입된 계정이 존재합니다</p>
                <p className="text-xs text-muted-foreground">
                  기존 계정(카카오)으로 자동 로그인합니다...
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit — always visible, disabled until code verified */}
      <Button
        size="lg"
        className="w-full mt-16"
        disabled={!isCodeValid || (verificationState as VerificationState) === 'duplicate'}
        onClick={handleVerify}
      >
        {verificationState === 'verifying' ? '확인 중...' : verificationState === 'duplicate' ? '자동 로그인 중...' : '시작하기'}
      </Button>
    </div>
  )
}
