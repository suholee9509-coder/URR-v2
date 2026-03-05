# URR (우르르) - K-POP 공정 티켓팅 플랫폼

## 프로젝트 개요
- **기술 스택**: React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- **UI 라이브러리**: shadcn/ui (Radix UI 기반)
- **라우팅**: React Router DOM v7
- **아이콘**: Lucide React
- **GitHub**: https://github.com/suholee9509-coder/URR-v2

## 프로젝트 구조

```
src/
├── assets/          # 이미지, SVG 로고 (로고5.svg 사용 중)
├── components/
│   ├── artist/      # 아티스트 상세 페이지 컴포넌트
│   ├── booking/     # 예매 플로우 (VQA, 대기열, 좌석선택, 결제)
│   ├── common/      # 공통 컴포넌트 (PaymentDialog)
│   ├── home/        # 홈페이지 섹션 (배너, 스켈레톤)
│   ├── layout/      # AppSidebar, TopBar, Footer, ContentArea
│   ├── membership/  # 멤버십 가입 플로우 (4단계)
│   ├── my-page/     # 마이페이지 탭 컴포넌트
│   ├── onboarding/  # 온보딩 (AuthStep, IdentityStep)
│   ├── transfer/    # 양도 상세 페이지
│   ├── ui/          # shadcn/ui 기본 컴포넌트
│   └── urr/         # URR 커스텀 컴포넌트 (TierBadge, EventCard 등)
├── contexts/        # BookingContext, LayoutContext, NotificationContext
├── data/            # Mock 데이터
├── hooks/           # 커스텀 훅
├── layouts/         # MainLayout, OnboardingLayout
├── lib/             # 유틸리티 (utils.ts, format.ts)
├── pages/           # 페이지 컴포넌트
└── types/           # TypeScript 타입 정의
```

## 주요 페이지 & 라우트

| 라우트 | 페이지 | 설명 |
|--------|--------|------|
| `/` | HomePage | 배너, 인기 아티스트, 지금 뜨는 공연, 랭킹, 선예매 |
| `/artists` | ArtistsPage | 아티스트 목록 |
| `/artists/:artistId` | ArtistPage | 아티스트 상세 (홈/소통/공연/양도 탭) |
| `/events` | EventsPage | 공연 목록 |
| `/events/:eventId` | BookingPage | 예매 플로우 |
| `/membership` | MembershipPage | 멤버십 가입 (4단계) |
| `/my-page` | MyPage | 마이페이지 (티켓/멤버십/양도/설정 탭) |
| `/onboarding` | OnboardingPage | 회원가입/로그인 |

## 핵심 기획 사항

### 멤버십 시스템
- **4개 티어**: Diamond > Gold > Silver > Bronze
- **가격**: 30,000원/년 (아티스트별 가입)
- **가입 플로우**: 아티스트 선택 → 티어 소개 → Mock 결제 → 완료 (멜론 연동 옵션)
- **멤버십 게이트**: 미가입자가 아티스트 상세 페이지 방문 시 홈 탭은 정상 표시, 소통/공연/양도 탭은 "멤버십 회원 전용" 게이트 표시

### 예매 플로우
1. VQA (시각적 질문 응답) 인증
2. 실시간 대기열 시스템
3. 구역 선택 → 좌석 선택
4. 결제 (Toss Payments 모킹)
5. 예매 확인

### 양도 마켓
- 마이페이지 양도 내역 탭에서 `listed` 상태 양도건 수정/취소 가능
- 수정: 가격 변경 (수수료 5% 자동 계산)
- 취소: 확인 다이얼로그 후 상태를 `cancelled`로 변경

### 홈페이지 섹션
1. 히어로 배너 캐러셀
2. 인기 아티스트 (10열 그리드)
3. **지금 뜨는 공연** (구 "오늘의 티켓팅" → 오해 방지 위해 명칭 변경)
4. 인기 공연 랭킹 (2열 8행)
5. 선예매 오픈 임박 (3열)

## 디자인 시스템 & 스타일

### 색상
- **Primary**: `#FF5E32` (오렌지)
- **Background**: `#FFFFFF`
- **Sidebar**: `#FBFAF8`
- **Accent**: `#F2F0E6`
- **홈 섹션 호버**: `#F6F5EE`

### 로고
- **현재 사용**: `로고5.svg` (146x146 정사각형)
- 사이드바: h-10, 푸터: h-11, 로그인: h-16, 온보딩 히어로: h-10

### 컴포넌트 컨벤션
- shadcn/ui 기반, `@/components/ui/` 하위
- URR 커스텀 컴포넌트는 `@/components/urr/` 하위
- 경로 별칭: `@/` → `src/`

## 빌드 & 배포
```bash
npm run dev      # 개발 서버
npm run build    # TypeScript 체크 + Vite 빌드
npm run preview  # 빌드 결과 미리보기
```

## 참고 문서
- [PRD](Docs/prd.md)
- [UX Spec](Docs/prd-ux-spec.md)
- [디자인 시스템](Docs/designsystem.md)
- [빌드 순서 프롬프트](Docs/building-order-prompts.md)
