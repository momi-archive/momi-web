# ADR-0002: 디자인 시스템 구성

- **상태**: 승인됨
- **날짜**: 2026-01-01

## 컨텍스트

- 피그마 없이 일관된 디자인으로 프론트엔드 개발 필요
- Claude 외에 다른 AI 도구(Cursor, Copilot 등)도 사용 예정
- 모든 도구가 동일한 디자인 가이드를 참조해야 함

### 요구사항

1. 일관된 디자인 언어 정의
2. AI 도구들이 참조할 수 있는 문서 구조
3. 코드로 디자인 토큰 강제
4. 반응형 디자인 지원

## 검토한 옵션

### 디자인 스타일

#### 옵션 1: 미니멀 & 클린

**장점**: 구현 단순, 유지보수 쉬움
**단점**: 차별화 어려움

#### 옵션 2: 토스 + Apple 리퀴드 글래스

**장점**: 세련됨, 깊이감, 현대적
**단점**: 글래스 효과 구현 복잡

#### 옵션 3: 다크 & 럭셔리

**장점**: 고급스러움
**단점**: 접근성 고려 필요

### 문서 구조

#### 옵션 1: CLAUDE.md에 모두 포함

**장점**: 단순
**단점**: Claude 전용, 다른 도구 미지원

#### 옵션 2: 분리된 문서 구조

```
DESIGN_SYSTEM.md  → 디자인 가이드 (공통)
CLAUDE.md         → Claude 전용
AGENTS.md         → 다른 AI 도구용
```

**장점**: 도구별 최적화, 유지보수 용이
**단점**: 파일 다수

### CSS 토큰 방식

#### 옵션 1: CSS 변수 (@layer base)

```css
:root {
  --color-primary-500: #3B82F6;
}
```

**사용**: `style={{ color: 'var(--color-primary-500)' }}`
**단점**: Tailwind 클래스로 사용 불가

#### 옵션 2: Tailwind v4 @theme

```css
@theme {
  --color-primary-500: #3B82F6;
}
```

**사용**: `className="bg-primary-500"`
**장점**: Tailwind 네이티브, 클래스로 바로 사용

## 결정

### 선택

| 항목 | 선택 | 이유 |
|------|------|------|
| 디자인 스타일 | **토스 + Apple 리퀴드 글래스** | 세련되고 현대적, 깊이감 표현 |
| 브랜드 컬러 | **블루 계열 (#3B82F6)** | 신뢰감, 안정감 |
| 폰트 | **Pretendard** | 한글 최적화, 가독성 |
| 문서 구조 | **분리형** | 도구별 최적화 |
| CSS 방식 | **Tailwind v4 @theme** | 클래스로 바로 사용 가능 |
| 반응형 | **Mobile First** | 모바일 기본, 확장 |

## 구현

### 생성된 파일

| 파일 | 역할 |
|------|------|
| `DESIGN_SYSTEM.md` | 전체 디자인 가이드 (진실의 원천) |
| `CLAUDE.md` | Claude Code 전용 컨텍스트 |
| `AGENTS.md` | 다른 AI 도구용 가이드 |
| `src/index.css` | Tailwind @theme 토큰 정의 |

### 디자인 토큰 (@theme)

```css
@theme {
  /* Primary */
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;

  /* Semantic */
  --color-success: #10B981;
  --color-error: #EF4444;

  /* Glass */
  --color-glass: rgba(255, 255, 255, 0.7);

  /* Radius */
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Shadow */
  --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### 커스텀 유틸리티

```css
@layer components {
  .glass {
    background: var(--color-glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
}
```

### 사용 예시

```tsx
// Primary 버튼
<button className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-6 py-3">

// 글래스 카드
<div className="glass rounded-lg p-6">

// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

## 결과

### 장점

- **일관성**: 모든 AI 도구가 동일한 디자인 참조
- **생산성**: Tailwind 클래스로 바로 사용
- **유지보수**: 토큰 변경 시 전체 반영
- **반응형**: Mobile First 패턴 정립

### 트레이드오프

- Tailwind v4 필수 (v3 미지원)
- Pretendard 폰트 CDN 또는 번들 필요 (향후 추가)
- 글래스 효과는 구형 브라우저 미지원 (backdrop-filter)

### 향후 고려

- [ ] Pretendard 폰트 설치/연결
- [ ] 다크 모드 지원
- [ ] 컴포넌트 라이브러리 구축 (Button, Input, Card 등)
- [ ] Storybook 도입 검토
