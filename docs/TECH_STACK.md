# 기술 스택 문서 (Tech Stack)

## 1. 개요
이 문서는 "나만의 아카이빙 서비스"를 구축하기 위한 기술적인 기반을 정의합니다. 생산성, 유지보수성, 그리고 확장성을 고려하여 선정되었습니다.

## 2. 프론트엔드 (Frontend) & 웹 (Web)
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
  - **이유**: 가벼운 SPA(Single Page Application) 구축, 빠른 개발 서버 구동, 최신 React 기능(Hooks 등) 활용.
- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - **이유**: 정적 타입 지정을 통한 버그 감소 및 개발 생산성 향상.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  - **이유**: 빠른 UI 개발, 일관된 디자인 시스템 적용 용이, 커스터마이징 유연성.
- **Icons**: [Lucide React](https://lucide.dev/)
  - **이유**: 깔끔하고 모던한 벡터 아이콘 라이브러리.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (필요시) 또는 React Context API.
  - **이유**: 가볍고 사용하기 쉬운 상태 관리.
- **Package Manager**: [pnpm](https://pnpm.io/)
  - **이유**: 빠르고 효율적인 설치 속도와 디스크 공간 절약 (Symlink 기반).

## 3. 백엔드 (Backend) & 데이터베이스 (Database)
- **Language**: [Kotlin](https://kotlinlang.org/)
- **Type**: RESTful API Server
  - **이유**: 별도의 백엔드 구축을 통한 API 연동. 유연한 비즈니스 로직 구현 가능.
- **Database**: 추후 결정 (Backend에서 관리)

## 4. 모바일 (Mobile)
- **Strategy**: PWA (Progressive Web App) 및 반응형 웹
  - **이유**: 별도의 앱 개발 없이 웹사이트를 모바일 환경에서 최적화하여 제공.
  - **Data Fetching**: TanStack Query (Web과 동일하게 사용)
  - **Future**: 필요 시 하이브리드 앱으로 확장 가능.

## 5. 인프라 및 배포 (Infrastructure & CI/CD)
- **Hosting**: [Vercel](https://vercel.com/)
  - **이유**: 호스팅 서비스로 최적의 호환성 및 자동 배포(CI/CD) 제공.
- **Version Control**: [GitHub](https://github.com/)
  - **이유**: 코드 관리 및 팀 개발 환경.

## 6. 주요 라이브러리 (Key Libraries)
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod (유효성 검사)
- **UI Components**: shadcn/ui (Radix UI 기반의 Headless UI + Tailwind CSS)
- **Drag & Drop**: dnd-kit (아이템 정리용, 선택사항)

## 7. 시스템 아키텍처 다이어그램 (간략)
```mermaid
graph TD
    User[사용자] -->|Web/Mobile Browser| Client[React SPA (PWA)]
    Client -->|API Call (TanStack Query)| API[Kotlin Backend API]
    API --> DB[(Database)]
```
