# ADR-0001: 테스트 환경 구성

- **상태**: 승인됨
- **날짜**: 2026-01-01

## 컨텍스트

- Vite + React 19 + TypeScript 프로젝트에서 테스트 환경이 필요
- Unit Test, Component Test, E2E Test를 모두 지원해야 함
- 커버리지 리포트는 추후 추가 예정

### 기술 스택

- Vite 7.2.4
- React 19.2.3
- TypeScript 5.9
- TanStack Query, Zustand, React Hook Form

## 검토한 옵션

### Unit/Component Test Runner

#### 옵션 1: Vitest

**장점**:
- Vite 네이티브 통합 (설정 공유, 빠른 속도)
- Jest API 완벽 호환
- ESM 기본 지원
- HMR 지원으로 watch 모드 빠름

**단점**:
- Jest보다 생태계가 작음 (빠르게 성장 중)

#### 옵션 2: Jest

**장점**:
- 가장 큰 생태계, 풍부한 자료
- 안정성 검증됨

**단점**:
- Vite 프로젝트에서 별도 설정 필요
- ESM 지원 복잡
- 상대적으로 느린 속도

### E2E Test Runner

#### 옵션 1: Playwright

**장점**:
- 멀티 브라우저 기본 지원 (Chromium, Firefox, WebKit)
- 병렬 실행 내장
- 현대적 async/await API
- CI에서 가볍고 빠름

**단점**:
- Cypress보다 커뮤니티 자료 적음

#### 옵션 2: Cypress

**장점**:
- 풍부한 문서, 큰 커뮤니티
- 직관적인 디버깅 UI

**단점**:
- 멀티 브라우저 제한적
- 병렬 실행은 유료
- 상대적으로 무거움

### DOM 환경

#### 옵션 1: jsdom

**장점**:
- 가장 널리 사용됨
- 풍부한 자료

**단점**:
- ESM 호환성 문제 발생 (실제로 겪음)

#### 옵션 2: happy-dom

**장점**:
- 더 빠른 속도
- ESM 호환성 좋음

**단점**:
- jsdom보다 작은 커뮤니티

## 결정

### 선택

| 용도 | 선택 | 이유 |
|------|------|------|
| Test Runner | **Vitest** | Vite 네이티브 통합, 빠른 속도 |
| E2E | **Playwright** | 멀티 브라우저, 현대적 API |
| DOM 환경 | **happy-dom** | ESM 호환성, 빠른 속도 |
| 컴포넌트 테스트 | **Testing Library** | 사용자 관점 테스트 철학 |

## 구현

### 변경/생성된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `vitest.config.ts` | 신규 - Vitest 설정 |
| `playwright.config.ts` | 신규 - Playwright 설정 |
| `src/test/setup.ts` | 신규 - 테스트 셋업 (모킹, 클린업) |
| `src/test/test-utils.tsx` | 신규 - Provider 래핑 커스텀 render |
| `package.json` | 테스트 스크립트 추가 |
| `tsconfig.json` | vitest/globals 타입 추가 |

### 설치한 패키지

```bash
# Unit/Component
pnpm add -D vitest @vitest/ui happy-dom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E
pnpm add -D @playwright/test
```

### 테스트 스크립트

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

### 디렉토리 구조

```
src/
├── test/
│   ├── setup.ts        # 전역 셋업
│   └── test-utils.tsx  # 커스텀 render
├── lib/
│   └── utils.test.ts   # Unit test 예시
└── pages/
    └── HomePage.test.tsx  # Component test 예시

e2e/
└── home.spec.ts        # E2E test 예시
```

## 결과

### 발생한 문제

#### 문제 1: jsdom ESM 호환성 에러

- **증상**: `require() of ES Module ... not supported` 에러
- **원인**: jsdom 27 버전의 의존성(html-encoding-sniffer)이 ESM 모듈을 CommonJS로 로드 시도
- **해결**: jsdom 대신 happy-dom 사용으로 전환

```typescript
// vitest.config.ts
test: {
  environment: 'happy-dom',  // 'jsdom'에서 변경
}
```

### 트레이드오프

- jsdom의 더 넓은 호환성을 포기하고 happy-dom의 ESM 호환성 선택
- happy-dom이 일부 edge case에서 jsdom과 다르게 동작할 수 있음

### 배운 점

- Vite 7.x + React 19 환경에서는 happy-dom이 jsdom보다 호환성이 좋음
- 최신 ESM 기반 프로젝트에서는 jsdom 의존성 충돌 주의 필요
- Playwright는 브라우저 설치가 별도로 필요함 (`pnpm exec playwright install`)
