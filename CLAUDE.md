# Momi Project

개인 아카이빙 서비스

## 기술 스택

- **프레임워크**: React 19 + TypeScript 5.9 + Vite 7
- **상태 관리**: TanStack Query (서버), Zustand (클라이언트)
- **폼**: React Hook Form + Zod
- **스타일**: TailwindCSS + shadcn/ui
- **테스트**: Vitest + Testing Library + Playwright

## 프로젝트 구조

```
src/
├── components/
│   └── ui/        # shadcn/ui 컴포넌트
├── pages/         # 페이지 컴포넌트
├── lib/           # 유틸리티 함수
├── hooks/         # 커스텀 훅
├── test/          # 테스트 유틸리티
e2e/               # E2E 테스트
docs/adr/          # 아키텍처 결정 기록
```

## 컨벤션

### 코드 스타일

- 컴포넌트: PascalCase, 함수형 컴포넌트만 사용
- 훅: use 접두사 (useAuth, useFetch)
- 유틸 함수: camelCase
- 상수: UPPER_SNAKE_CASE

### 테스트

- Unit/Component: 소스 파일 옆에 `*.test.ts(x)` 배치
- E2E: `e2e/` 폴더에 `*.spec.ts` 배치
- Provider 필요 시 `renderWithProviders()` 사용

### 커밋

- Conventional Commits 스타일 (한국어)
- 예: `feat(auth): 로그인 기능 추가`

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm test         # Vitest watch 모드
pnpm test:run     # Vitest 단일 실행
pnpm test:e2e     # Playwright E2E 테스트
pnpm lint         # ESLint 검사
```

## 디자인

**중요**: UI 개발 시 반드시 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) 참조

- **컴포넌트**: shadcn/ui (Radix UI + Tailwind)
- **스타일**: 토스 + Apple 리퀴드 글래스
- **컬러**: 블루 계열 Primary (#3B82F6)
- **폰트**: Pretendard
- **특징**: 글래스모피즘, 부드러운 그림자, 충분한 여백

### shadcn/ui 컴포넌트

```bash
# 컴포넌트 추가
pnpm dlx shadcn@latest add [컴포넌트명]

# 설치된 컴포넌트: button, input, card, dialog, dropdown-menu, avatar, badge, tabs, form, label, sonner
```

## 문서

- [디자인 시스템](./DESIGN_SYSTEM.md) - 컬러, 타이포, 컴포넌트 가이드
- [ADR 목록](./docs/adr/README.md) - 기술 결정 기록
