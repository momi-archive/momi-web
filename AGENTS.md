# Momi Project - AI Agent Guidelines

이 문서는 AI 코딩 어시스턴트(Cursor, Copilot, Windsurf 등)를 위한 프로젝트 가이드입니다.

## 프로젝트 개요

**Momi** - 개인 아카이빙 서비스

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript 5.9 + Vite 7 |
| 상태 관리 | TanStack Query (서버), Zustand (클라이언트) |
| 폼 | React Hook Form + Zod |
| 스타일 | TailwindCSS + shadcn/ui |
| 테스트 | Vitest + Testing Library + Playwright |

## 디자인 시스템

**필수**: UI 개발 시 반드시 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) 참조

### 컴포넌트 라이브러리

**shadcn/ui** 사용 (Radix UI + Tailwind CSS)

```bash
# 컴포넌트 추가
pnpm dlx shadcn@latest add [컴포넌트명]
```

설치된 컴포넌트: `button`, `input`, `card`, `dialog`, `dropdown-menu`, `avatar`, `badge`, `tabs`, `form`, `label`, `sonner`

### 스타일 방향

- **토스 + Apple 리퀴드 글래스** 스타일
- 명료함, 깊이감, 부드러움, 충분한 여백

### 핵심 디자인 토큰

```css
/* Primary 컬러 */
--color-primary-500: #3B82F6;

/* 모서리 (최소 8px) */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;

/* 그림자 (부드럽게) */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);

/* 글래스 효과 */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
}
```

### 폰트

- Sans: Pretendard
- Mono: JetBrains Mono

## 프로젝트 구조

```
src/
├── api/           # API 함수
├── components/
│   └── ui/        # shadcn/ui 컴포넌트
├── hooks/         # 커스텀 훅 (TanStack Query 훅 포함)
├── pages/         # 페이지 컴포넌트
├── lib/           # 유틸리티 함수
├── test/          # 테스트 유틸리티
├── types/         # TypeScript 타입 정의
e2e/               # E2E 테스트
docs/adr/          # 아키텍처 결정 기록
```

## 코드 컨벤션

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `UserProfile.tsx` |
| 훅 | use 접두사 | `useUser.ts` |
| 유틸 함수 | camelCase | `formatDate.ts` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 타입/인터페이스 | PascalCase | `User`, `ApiResponse` |

### 컴포넌트

- 함수형 컴포넌트만 사용
- Props는 인터페이스로 정의
- 한 파일에 하나의 컴포넌트

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={cn('rounded-lg px-4 py-2', variants[variant])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### API 훅 패턴

```tsx
// src/hooks/useUser.ts
export const userKeys = {
  all: ['user'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
};

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  });
}
```

### 테스트

- 소스 파일 옆에 `*.test.tsx` 배치
- `renderWithProviders()` 사용 (Provider 래핑)
- E2E는 `e2e/` 폴더에 `*.spec.ts`

## 디자인 규칙

### DO ✅

- CSS 변수 사용 (`var(--color-primary-500)`)
- 8px 그리드 간격
- 충분한 여백
- 둥근 모서리 (최소 8px)
- 부드러운 그림자
- `.glass` 클래스로 글래스 효과

### DON'T ❌

- 하드코딩된 컬러값
- 날카로운 모서리 (4px 이하)
- `#000000` 순수 검정 사용
- 과도한 그라데이션
- Inter, Arial 등 제네릭 폰트

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm test         # Vitest watch
pnpm test:run     # Vitest 단일 실행
pnpm test:e2e     # Playwright E2E
pnpm lint         # ESLint
```

## 문서 참조

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - 전체 디자인 가이드
- [docs/adr/](./docs/adr/) - 아키텍처 결정 기록
