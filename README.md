# 🌙 Momi (모미)

> **"영감을 기록하고, 나만의 공간을 채우다."**

Momi는 웹 서핑 중 발견한 영감 넘치는 링크와 떠오르는 아이디어를 마크다운 형식으로 빠르게 기록하고 관리할 수 있는 **개인용 아카이빙 서비스**입니다.

## ✨ 주요 기능

- **🏠 스마트 대시보드**: 사이드바와 그리드 레이아웃을 통해 기록을 한눈에 관리
- **🔗 링크 아카이빙**: 중요한 웹 페이지 링크를 카테고리별로 저장
- **📝 마크다운 메모**: 생각을 자유롭게 기록하고 마크다운 문법으로 서식 관리
- **📂 카테고리 시스템**: 커스텀 컬러와 이름을 가진 카테고리로 데이터 분류
- **🔍 실시간 검색**: 제목과 내용을 기반으로 필요한 기록을 즉시 검색
- **🌓 다크 모드**: 눈이 편안한 Midnight & Aurora 테마 지원
- **🔒 개인화된 보안**: Google OAuth 로그인 및 RLS 정책을 통해 자신만의 프라이빗한 공간 보장

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide React
- **UI Library**: Shadcn/UI (Radix UI)
- **Backend**: Supabase (Database, Authentication, RLS)
- **State Management**: TanStack Query (React Query)
- **Styling**: Vanilla CSS Variables (Midnight & Aurora Design System)
- **Deployment**: Vercel

## 🚀 시작하기

1. **저장소 클론**
   ```bash
   git clone https://github.com/momi-archive/momi-web.git
   ```

2. **의존성 설치**
   ```bash
   pnpm install
   ```

3. **환경 변수 설정**
   `.env` 파일을 루트 디렉토리에 생성하고 Supabase 정보를 입력합니다.
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **개발 서버 실행**
   ```bash
   pnpm dev
   ```

## 🗺 Roadmap

자세한 개발 현황 및 향후 계획은 [ROADMAP.md](./docs/ROADMAP.md)에서 확인하실 수 있습니다.
