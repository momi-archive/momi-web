---
name: api-hook-generator
description: TanStack Query 기반의 API 훅을 생성합니다. useQuery, useMutation, useInfiniteQuery 훅과 API 함수를 함께 작성합니다. API 훅 생성, 데이터 페칭 훅 작성 요청 시 사용하세요.
allowed-tools: Read, Write, Glob, Grep
---

# TanStack Query API 훅 생성기

## 개요

이 skill은 TanStack Query v5 기반의 타입 안전한 API 훅을 생성합니다.

## 생성 파일 구조

```
src/
├── api/
│   └── [domain].ts          # API 함수 정의
└── hooks/
    └── use[Domain].ts       # Query/Mutation 훅
```

## 지침

### 1. 사용자에게 확인할 정보

- **도메인명**: API가 다루는 리소스 (예: user, post, product)
- **엔드포인트**: API URL 경로
- **HTTP 메서드**: GET, POST, PUT, DELETE
- **요청/응답 타입**: TypeScript 인터페이스

### 2. API 함수 작성 (src/api/[domain].ts)

```typescript
import type { [RequestType], [ResponseType] } from '@/types/[domain]'

const API_BASE = '/api'

export const [domain]Api = {
  // GET 단일 조회
  get[Domain]: async (id: string): Promise<[ResponseType]> => {
    const response = await fetch(`${API_BASE}/[endpoint]/${id}`)
    if (!response.ok) throw new Error('Failed to fetch')
    return response.json()
  },

  // GET 목록 조회
  get[Domain]List: async (params?: [QueryParams]): Promise<[ResponseType][]> => {
    const searchParams = new URLSearchParams(params as Record<string, string>)
    const response = await fetch(`${API_BASE}/[endpoint]?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch')
    return response.json()
  },

  // POST 생성
  create[Domain]: async (data: [RequestType]): Promise<[ResponseType]> => {
    const response = await fetch(`${API_BASE}/[endpoint]`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create')
    return response.json()
  },

  // PUT 수정
  update[Domain]: async (id: string, data: [RequestType]): Promise<[ResponseType]> => {
    const response = await fetch(`${API_BASE}/[endpoint]/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update')
    return response.json()
  },

  // DELETE 삭제
  delete[Domain]: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/[endpoint]/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete')
  },
}
```

### 3. Query 훅 작성 (src/hooks/use[Domain].ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { [domain]Api } from '@/api/[domain]'
import type { [RequestType], [ResponseType] } from '@/types/[domain]'

// Query Keys
export const [domain]Keys = {
  all: ['[domain]'] as const,
  lists: () => [...[domain]Keys.all, 'list'] as const,
  list: (params?: [QueryParams]) => [...[domain]Keys.lists(), params] as const,
  details: () => [...[domain]Keys.all, 'detail'] as const,
  detail: (id: string) => [...[domain]Keys.details(), id] as const,
}

// 단일 조회
export function use[Domain](id: string) {
  return useQuery({
    queryKey: [domain]Keys.detail(id),
    queryFn: () => [domain]Api.get[Domain](id),
    enabled: !!id,
  })
}

// 목록 조회
export function use[Domain]List(params?: [QueryParams]) {
  return useQuery({
    queryKey: [domain]Keys.list(params),
    queryFn: () => [domain]Api.get[Domain]List(params),
  })
}

// 생성
export function useCreate[Domain]() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: [domain]Api.create[Domain],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [domain]Keys.lists() })
    },
  })
}

// 수정
export function useUpdate[Domain]() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: [RequestType] }) =>
      [domain]Api.update[Domain](id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [domain]Keys.detail(id) })
      queryClient.invalidateQueries({ queryKey: [domain]Keys.lists() })
    },
  })
}

// 삭제
export function useDelete[Domain]() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: [domain]Api.delete[Domain],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [domain]Keys.lists() })
    },
  })
}
```

### 4. 무한 스크롤용 훅 (필요시)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

export function use[Domain]Infinite(params?: Omit<[QueryParams], 'page'>) {
  return useInfiniteQuery({
    queryKey: [domain]Keys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      [domain]Api.get[Domain]List({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined
    },
  })
}
```

## 컨벤션

### 네이밍

- API 함수: `[domain]Api.get[Domain]`, `[domain]Api.create[Domain]`
- Query 훅: `use[Domain]`, `use[Domain]List`
- Mutation 훅: `useCreate[Domain]`, `useUpdate[Domain]`, `useDelete[Domain]`
- Query Keys: `[domain]Keys.all`, `[domain]Keys.detail(id)`

### Query Options

- `enabled`: 조건부 쿼리 실행 (id가 없으면 실행 안함)
- `staleTime`: 데이터 신선도 유지 시간 (기본 0)
- `gcTime`: 가비지 컬렉션 시간 (기본 5분)

### Mutation Options

- `onSuccess`: 성공 시 관련 쿼리 무효화
- `onError`: 에러 처리 (토스트 메시지 등)
- `onSettled`: 성공/실패 관계없이 실행

## 사용 예시

```typescript
// 컴포넌트에서 사용
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId)
  const updateUser = useUpdateUser()

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      updateUser.mutate({ id: userId, data: formData })
    }}>
      {/* form fields */}
    </form>
  )
}
```
