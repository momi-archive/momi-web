# 🗺️ Momi 프로젝트 로드맵

## ✅ 완료된 작업 (Completed)
### 1. 프로젝트 설정
- [x] React + Vite + TypeScript + Tailwind CSS 환경 구성
- [x] Shadcn/UI 컴포넌트 라이브러리 설치
- [x] Supabase 연동 (Client 초기화)

### 2. 디자인 시스템 (Midnight & Aurora)
- [x] 테마 컬러 정의 (Indigo, Teal, Violet Gradients)
- [x] 폰트 적용 (Heading: Outfit, Body: Pretendard)
- [x] 다크 모드 기반의 Glassmorphism UI 스타일 적용

### 3. 핵심 기능 (Archiving MVP)
- [x] **DB 스키마 설계**: `archives` (링크/메모 통합), `categories` 테이블
- [x] **메인 페이지**: 사이드바 + 그리드 레이아웃
- [x] **기록 추가 (Modal)**: 링크 및 마크다운 메모 저장 기능
- [x] **조회 및 필터링**: 전체 목록 조회 및 카테고리별 필터링
- [x] **전체 한글화**: UI 텍스트 국문 적용

---

## 🚧 남은 작업 (Current Tasks)
### 1. 필수 기능 보완
- [ ] **수정/삭제 기능**: 저장된 기록을 수정하거나 잘못된 기록 삭제 (현재 삭제만 구현됨, 수정 필요)
- [ ] **반응형 모바일 UI**: 모바일에서 사이드바 처리 (현재 `hidden` 처리됨)

---

## 🚀 추가 제안 기능 (Backlog)
### 1. 사용자 경험 개선
- [ ] **OG 태그 자동 수집** (⭐ 우선순위)
    - 링크 입력 시 제목, 설명, 썸네일 이미지를 자동으로 가져오는 기능
    - *기술 요건*: Supabase Edge Function 필요
- [ ] **검색 기능**
    - 제목, 내용, 태그로 기록 검색

### 2. 데이터 관리
- [ ] **태그 시스템**
    - 카테고리 외에 `#태그`를 통한 유연한 분류
- [ ] **정렬 옵션**
    - 최신순, 오래된순, 가나다순 정렬

### 3. 인증 및 보안
- [ ] **로그인/회원가입**
    - 현재는 공용(Public)으로 열려있음. 개인화된 서비스를 위해 Auth 적용 필요
    - *참고*: DB RLS(Row Level Security) 정책 업데이트 필요
