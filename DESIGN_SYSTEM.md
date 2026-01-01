# Momi Design System

## 디자인 철학

**토스의 명료함 + Apple 리퀴드 글래스의 우아함**

- **명료함**: 한 화면에 하나의 목적, 불필요한 요소 제거
- **깊이감**: 글래스모피즘으로 레이어 간 시각적 계층 표현
- **부드러움**: 둥근 모서리, 부드러운 그림자, 자연스러운 트랜지션
- **여백**: 충분한 화이트 스페이스로 호흡감 부여

---

## 컬러 시스템

### Primary (브랜드 블루)

| 토큰 | 값 | Tailwind 클래스 | 용도 |
|------|-----|-----------------|------|
| primary-50 | #EFF6FF | `bg-primary-50` | 배경 |
| primary-100 | #DBEAFE | `bg-primary-100` | 호버 배경 |
| primary-200 | #BFDBFE | `border-primary-200` | 보더 |
| primary-500 | #3B82F6 | `bg-primary-500` | 메인 액션 |
| primary-600 | #2563EB | `bg-primary-600` | 호버 |
| primary-700 | #1D4ED8 | `text-primary-700` | 액티브, 텍스트 |

### Neutral (그레이스케일)

| Tailwind 클래스 | 용도 |
|-----------------|------|
| `bg-gray-50` | 페이지 배경 |
| `bg-gray-100` | 카드 배경 |
| `border-gray-200` | 보더, 구분선 |
| `text-gray-400` | 플레이스홀더 |
| `text-gray-500` | 보조 텍스트 |
| `text-gray-700` | 본문 텍스트 |
| `text-gray-900` | 제목 텍스트 |

### Semantic (상태)

| 토큰 | Tailwind 클래스 | 용도 |
|------|-----------------|------|
| success | `text-success`, `bg-success` | 성공, 완료 |
| warning | `text-warning`, `bg-warning` | 경고, 주의 |
| error | `text-error`, `bg-error` | 에러, 삭제 |

---

## 타이포그래피

### 폰트

- **Sans**: Pretendard (`font-sans`)
- **Mono**: JetBrains Mono (`font-mono`)

### 크기 & Tailwind 클래스

| 용도 | Tailwind 클래스 |
|------|-----------------|
| Display | `text-5xl font-bold` |
| H1 | `text-3xl font-bold` |
| H2 | `text-2xl font-semibold` |
| H3 | `text-xl font-semibold` |
| Body Large | `text-lg` |
| Body | `text-base` |
| Body Small | `text-sm` |
| Caption | `text-xs` |

---

## 간격 시스템

8px 기반 그리드 (Tailwind 기본값 사용):

| 간격 | Tailwind | 용도 |
|------|----------|------|
| 4px | `p-1`, `m-1`, `gap-1` | 아이콘-텍스트 간격 |
| 8px | `p-2`, `m-2`, `gap-2` | 작은 요소 내부 |
| 12px | `p-3`, `m-3`, `gap-3` | 컴포넌트 내부 |
| 16px | `p-4`, `m-4`, `gap-4` | 기본 패딩 |
| 24px | `p-6`, `m-6`, `gap-6` | 카드 내부 |
| 32px | `p-8`, `m-8`, `gap-8` | 섹션 간격 |
| 48px | `p-12`, `gap-12` | 큰 섹션 간격 |
| 64px | `p-16`, `gap-16` | 페이지 섹션 |

---

## 모서리 반경

| 토큰 | Tailwind 클래스 | 용도 |
|------|-----------------|------|
| 8px | `rounded-sm` | 작은 버튼, 태그 |
| 12px | `rounded-md` | 인풋, 일반 버튼 |
| 16px | `rounded-lg` | 카드 |
| 24px | `rounded-xl` | 모달, 바텀시트 |
| 9999px | `rounded-full` | 원형 아바타, 필 |

---

## 그림자 시스템

| 토큰 | Tailwind 클래스 | 용도 |
|------|-----------------|------|
| soft | `shadow-soft` | 기본 카드 |
| medium | `shadow-medium` | 호버, 팝오버 |
| glass | `shadow-glass` | 글래스 카드 |

---

## shadcn/ui 컴포넌트

프로젝트는 [shadcn/ui](https://ui.shadcn.com)를 사용합니다. Radix UI 기반의 접근성 좋은 컴포넌트를 Tailwind로 스타일링합니다.

### 설치된 컴포넌트

| 컴포넌트 | import 경로 | 용도 |
|---------|-------------|------|
| Button | `@/components/ui/button` | 버튼 |
| Input | `@/components/ui/input` | 입력 필드 |
| Card | `@/components/ui/card` | 카드 레이아웃 |
| Dialog | `@/components/ui/dialog` | 모달/다이얼로그 |
| DropdownMenu | `@/components/ui/dropdown-menu` | 드롭다운 메뉴 |
| Avatar | `@/components/ui/avatar` | 아바타 |
| Badge | `@/components/ui/badge` | 배지/태그 |
| Tabs | `@/components/ui/tabs` | 탭 UI |
| Form | `@/components/ui/form` | 폼 (RHF 통합) |
| Label | `@/components/ui/label` | 라벨 |
| Sonner | `@/components/ui/sonner` | 토스트 알림 |

### 사용 예시

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// 버튼 variants
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// 카드
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="입력하세요" />
  </CardContent>
</Card>
```

### 컴포넌트 추가

```bash
pnpm dlx shadcn@latest add [컴포넌트명]
```

### shadcn/ui + 커스텀 스타일 조합

shadcn/ui 컴포넌트와 커스텀 스타일을 함께 사용:

```tsx
// shadcn Button + 커스텀 호버 효과
<Button className="hover:-translate-y-0.5 hover:shadow-soft transition-all">
  버튼
</Button>

// shadcn Card + 글래스 효과
<Card className="glass">
  <CardContent>글래스 카드</CardContent>
</Card>
```

---

## 커스텀 컴포넌트 스타일

shadcn/ui에 없는 커스텀 스타일:

### 버튼

```tsx
// Primary Button
<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold transition-all hover:-translate-y-0.5 hover:shadow-soft">
  버튼
</button>

// Secondary Button
<button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors">
  버튼
</button>

// Ghost Button
<button className="hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-md transition-colors">
  버튼
</button>
```

### 카드 (글래스 효과)

```tsx
// 기본 글래스 카드
<div className="glass rounded-lg p-6">
  콘텐츠
</div>

// 그림자 강조 글래스 카드
<div className="glass rounded-xl p-6 shadow-glass">
  콘텐츠
</div>
```

### 인풋

```tsx
<input
  className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
  placeholder="입력하세요"
/>
```

### 카드

```tsx
<div className="bg-white rounded-lg p-6 shadow-soft">
  <h3 className="text-lg font-semibold text-gray-900">제목</h3>
  <p className="text-gray-500 mt-2">설명 텍스트</p>
</div>
```

---

## 트랜지션

| 용도 | Tailwind 클래스 |
|------|-----------------|
| 기본 | `transition-all` 또는 `transition-colors` |
| 빠른 | `duration-150` |
| 보통 | `duration-200` (기본값) |
| 느린 | `duration-300` |

### 호버 효과

```tsx
// 살짝 올라오는 효과
<div className="transition-transform hover:-translate-y-1">

// 그림자 추가
<div className="transition-shadow hover:shadow-medium">

// 배경색 변경
<div className="transition-colors hover:bg-gray-100">
```

---

## 레이아웃

### 컨테이너

```tsx
<div className="max-w-5xl mx-auto px-4 md:px-6">
  콘텐츠
</div>
```

### 브레이크포인트

| 크기 | Tailwind 접두사 | 용도 |
|------|-----------------|------|
| < 640px | (기본) | 모바일 |
| 640px | `sm:` | 큰 모바일 |
| 768px | `md:` | 태블릿 |
| 1024px | `lg:` | 작은 데스크톱 |
| 1280px | `xl:` | 데스크톱 |

---

## 반응형 디자인

### 원칙: Mobile First

모바일 스타일을 기본으로, 큰 화면에서 확장:

```tsx
// ✅ Mobile First (권장)
<div className="px-4 md:px-6 lg:px-8">

// ❌ Desktop First (비권장)
<div className="px-8 md:px-6 sm:px-4">
```

### 반응형 그리드

```tsx
// 1열 → 2열 → 3열
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card />
  <Card />
  <Card />
</div>

// 사이드바 레이아웃 (모바일: 숨김, 데스크톱: 사이드바)
<div className="flex flex-col lg:flex-row">
  <aside className="hidden lg:block lg:w-64">사이드바</aside>
  <main className="flex-1">메인 콘텐츠</main>
</div>
```

### 반응형 타이포그래피

```tsx
// 제목: 모바일 작게 → 데스크톱 크게
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  제목
</h1>

// 본문
<p className="text-sm md:text-base">
  설명 텍스트
</p>
```

### 반응형 간격

```tsx
// 섹션 간격
<section className="py-8 md:py-12 lg:py-16">

// 카드 패딩
<div className="p-4 md:p-6">

// 컴포넌트 간 간격
<div className="space-y-4 md:space-y-6">
```

### 반응형 컴포넌트 예시

#### 반응형 카드 그리드

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {items.map(item => (
    <div className="glass rounded-lg p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-semibold">{item.title}</h3>
      <p className="text-sm md:text-base text-gray-500 mt-2">{item.description}</p>
    </div>
  ))}
</div>
```

#### 반응형 네비게이션

```tsx
<nav className="flex items-center justify-between px-4 md:px-6 py-4">
  <Logo />

  {/* 데스크톱 메뉴 */}
  <div className="hidden md:flex items-center gap-6">
    <NavLink>홈</NavLink>
    <NavLink>서비스</NavLink>
    <NavLink>문의</NavLink>
  </div>

  {/* 모바일 햄버거 */}
  <button className="md:hidden">
    <Menu className="w-6 h-6" />
  </button>
</nav>
```

#### 반응형 히어로 섹션

```tsx
<section className="py-12 md:py-20 lg:py-28 px-4 md:px-6">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
      메인 타이틀
    </h1>
    <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
      서브 텍스트 설명
    </p>
    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
      <button className="bg-primary-500 text-white px-6 py-3 rounded-md">
        시작하기
      </button>
      <button className="border border-gray-200 px-6 py-3 rounded-md">
        더 알아보기
      </button>
    </div>
  </div>
</section>
```

#### 반응형 폼

```tsx
<form className="space-y-4 md:space-y-6 max-w-md mx-auto px-4">
  {/* 2열 입력 (모바일: 1열) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input className="..." placeholder="이름" />
    <input className="..." placeholder="이메일" />
  </div>

  <textarea className="w-full ..." rows={4} placeholder="메시지" />

  <button className="w-full sm:w-auto bg-primary-500 text-white px-6 py-3 rounded-md">
    전송
  </button>
</form>
```

### 반응형 숨김/표시

| 클래스 | 동작 |
|--------|------|
| `hidden md:block` | 모바일 숨김, 태블릿+ 표시 |
| `block md:hidden` | 모바일 표시, 태블릿+ 숨김 |
| `hidden lg:flex` | 데스크톱에서만 flex 표시 |

---

## 아이콘

- **라이브러리**: Lucide React
- **크기**: `w-4 h-4` (인라인), `w-5 h-5` (버튼), `w-6 h-6` (독립)

```tsx
import { Search } from 'lucide-react';

<Search className="w-5 h-5 text-gray-500" />
```

---

## DO & DON'T

### DO ✅

- Tailwind 유틸리티 클래스 사용
- `glass` 클래스로 글래스 효과
- `rounded-md` 이상의 둥근 모서리
- `text-gray-900` (제목), `text-gray-500` (보조)
- `transition-*` 클래스로 부드러운 효과

### DON'T ❌

- 하드코딩된 컬러값 (`#3B82F6` 직접 사용)
- `rounded-sm` 미만의 날카로운 모서리
- `text-black` (순수 검정) 사용
- 인라인 스타일 (`style={{ }}`)
- 과도한 그라데이션

---

## 참고 레퍼런스

- [shadcn/ui](https://ui.shadcn.com) - 컴포넌트 라이브러리
- [토스 디자인 시스템](https://toss.im/design-system)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Pretendard 폰트](https://cactus.tistory.com/306)
