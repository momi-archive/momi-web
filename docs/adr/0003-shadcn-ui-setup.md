# ADR-0003: shadcn/ui 컴포넌트 라이브러리 도입

- **상태**: 승인됨
- **날짜**: 2026-01-01

## 컨텍스트

- Tailwind CSS만으로 모든 컴포넌트를 직접 구현하는 것은 시간 소모적
- 접근성(a11y)을 고려한 컴포넌트 구현이 복잡함
- 일관된 디자인 시스템 유지 필요
- Tailwind v4와 호환되는 컴포넌트 라이브러리 필요

### 요구사항

1. Tailwind CSS와 완벽한 통합
2. 접근성(a11y) 기본 지원
3. 커스터마이징 자유도
4. Tailwind v4 지원
5. 기존 디자인 시스템과 충돌 없음

## 검토한 옵션

### 옵션 1: 직접 구현

**장점**: 완전한 제어권
**단점**: 개발 시간 많이 소요, 접근성 구현 복잡

### 옵션 2: Headless UI

**장점**: 접근성 좋음
**단점**: Tailwind Labs 제품이나 컴포넌트 수 제한적

### 옵션 3: shadcn/ui

**장점**:
- Radix UI 기반 접근성
- 코드를 프로젝트에 복사하여 완전한 커스터마이징
- Tailwind v4 공식 지원
- 40+ 컴포넌트 제공
- 패키지 의존성 없음 (코드 소유)

**단점**:
- 수동 설치 필요 (Tailwind v4)
- 컴포넌트 업데이트 시 수동 반영

### 옵션 4: Chakra UI / MUI

**장점**: 완성도 높음
**단점**: CSS-in-JS 방식, Tailwind와 충돌 가능

## 결정

### 선택: shadcn/ui

| 항목 | 선택 | 이유 |
|------|------|------|
| 라이브러리 | **shadcn/ui** | Tailwind 네이티브, 커스터마이징 자유 |
| 스타일 | **new-york** | 깔끔하고 현대적 |
| 베이스 컬러 | **neutral** | 기존 primary blue와 조합 |

## 구현

### 설치 방식

Tailwind v4에서는 CLI 자동 설정이 안 되어 수동 설치 진행:

1. 의존성 설치
```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

2. `components.json` 생성
3. CSS 변수 설정 (`@theme inline`)
4. 컴포넌트 추가

### 생성된 파일

| 파일 | 역할 |
|------|------|
| `components.json` | shadcn/ui 설정 |
| `src/components/ui/*.tsx` | UI 컴포넌트들 |
| `src/index.css` | CSS 변수 + @theme inline |

### 설치된 컴포넌트

| 컴포넌트 | 용도 |
|---------|------|
| Button | 버튼 (variants: default, secondary, outline, ghost, destructive) |
| Input | 입력 필드 |
| Card | 카드 레이아웃 |
| Dialog | 모달/다이얼로그 |
| DropdownMenu | 드롭다운 메뉴 |
| Avatar | 아바타/프로필 이미지 |
| Badge | 배지/태그 |
| Tabs | 탭 UI |
| Form | 폼 (React Hook Form 통합) |
| Label | 라벨 |
| Sonner | 토스트 알림 |

### CSS 구조

```css
/* shadcn/ui 변수 (HSL) */
:root {
  --primary: 217.2 91.2% 59.8%;  /* blue */
  --background: 0 0% 100%;
  ...
}

/* Tailwind v4 통합 */
@theme inline {
  --color-primary: hsl(var(--primary));
  --color-background: hsl(var(--background));
  ...
}

/* Momi 커스텀 토큰 */
@theme {
  --color-primary-500: #3B82F6;
  --color-glass: rgba(255, 255, 255, 0.7);
  ...
}
```

### 사용 예시

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// shadcn 기본 사용
<Button>클릭</Button>
<Button variant="outline">아웃라인</Button>

// 커스텀 스타일 조합
<Button className="hover:-translate-y-0.5 shadow-soft">
  호버 효과 추가
</Button>

// 글래스 효과 조합
<Card className="glass">
  <CardContent>글래스 카드</CardContent>
</Card>
```

## 결과

### 장점

- **생산성**: 기본 컴포넌트 즉시 사용
- **접근성**: Radix UI 기반 키보드/스크린리더 지원
- **일관성**: 통일된 디자인 언어
- **유연성**: 코드 소유로 자유로운 커스터마이징
- **호환성**: 기존 디자인 시스템과 충돌 없음

### 트레이드오프

- Tailwind v4에서 수동 설치 필요
- 컴포넌트 업데이트 시 수동 반영 필요
- CSS 파일 크기 증가 (20KB → 43KB)

### 향후 고려

- [ ] 추가 컴포넌트 설치 (Select, Popover, Sheet 등)
- [ ] 다크 모드 토글 구현
- [ ] 컴포넌트 커스터마이징 (브랜드 스타일 적용)
