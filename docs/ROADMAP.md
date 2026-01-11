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
- [x] **기록 관리 (CRUD)**: 링크 및 마크다운 메모의 저장, 수정, 삭제 기능
- [x] **조회 및 필터링**: 전체 목록 조회 및 카테고리별 필터링
- [x] **검색 기능**: 제목 및 내용을 기반으로 한 실시간 검색
- [x] **전체 한글화**: UI 텍스트 국문 적용

### 4. 사용자 경험 및 보안
- [x] **다크 모드**: `next-themes`를 이용한 라이트/다크 테마 전환 및 다크 테마 디자인 최적화
- [x] **인증 및 보안 (Google OAuth)**:
    - Google 계정을 이용한 간편 로그인 구현
    - DB RLS(Row Level Security) 적용으로 사용자별 데이터 완벽 격리 (개인 전용 공간)
- [x] **배포 인프라**: Vercel을 통한 자동 배포 환경 구축 및 환경 변수 관리
- [x] **OG 태그 자동 수집**: 링크 입력 시 제목, 설명, 썸네일 이미지를 자동으로 가져오는 기능
- [x] **삭제 확인 다이얼로그**: 실수로 인한 삭제 방지를 위한 공통 확인 UI 구현

---

## 🚧 남은 작업 (Current Tasks)
### 1. 사용자 경험 개선
- [ ] **반응형 모바일 UI**: 모바일에서 사이드바 처리 (현재 `hidden` 처리됨)

---

## 🚀 추가 제안 기능 (Backlog)
### 1. 데이터 관리 및 유연성
- [ ] **태그 시스템**: 카테고리 외에 `#태그`를 통한 유연한 분류
- [ ] **정렬 옵션**: 최신순, 오래된순, 가나다순 정렬
- [ ] **이미지 첨부**: 메모 내 이미지 업로드 및 관리 (Supabase Storage 활용)
