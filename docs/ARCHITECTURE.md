# ARCHITECTURE

본 문서는 구조, 상태/라우팅 설계, 핵심 구현 포인트를 기술적으로 상세히 설명합니다.

## 레이어 구조 (Slim FSD)

- **App (Routing):** 페이지/레이아웃은 [src/app](src/app)에서 관리합니다. 전역 Provider는 [src/app/Providers.tsx](src/app/Providers.tsx).
- **Widgets (Compositions):** 페이지에서 조립하는 단위. 예: [widgets/course-list/CourseList.tsx](src/widgets/course-list/CourseList.tsx), [widgets/enroll-summary/EnrollSummary.tsx](src/widgets/enroll-summary/EnrollSummary.tsx).
- **Features (Use-cases):** 특정 기능의 UI/모델. 예: 선택 상태 [features/course-select/model/useCourseSelect.ts](src/features/course-select/model/useCourseSelect.ts), 강의 등록 [features/create-course/ui/CreateCourseForm.tsx](src/features/create-course/ui/CreateCourseForm.tsx).
- **Entities (Domain):** 도메인 모델/타입/API. 예: 강의 목록 API [entities/course/api/fetchCourses.ts](src/entities/course/api/fetchCourses.ts), 배치 수강 [entities/enrollment/api/enrollBatchAPI.ts](src/entities/enrollment/api/enrollBatchAPI.ts).
- **Shared (Cross-cutting):** 공통 라이브러리/에러/페처. 예: API 페처 [shared/api/fetcher.ts](src/shared/api/fetcher.ts), Intersection 훅 [shared/lib/useIntersection.ts](src/shared/lib/useIntersection.ts), 에러 타입 [shared/lib/errors/errorTypes.ts](src/shared/lib/errors/errorTypes.ts).

## 상태 관리 설계

- **Server State:** `TanStack Query`로 페칭/캐싱/동기화. 강의 목록은 무한 쿼리로 관리: [widgets/course-list/useCoursesQuery.ts](src/widgets/course-list/useCoursesQuery.ts)
  - `queryKey`: `["courses", { sort }]`로 URL 상태와 일관화
  - `staleTime`: 60초로 과도한 refetch 방지
  - `getNextPageParam`: `last` 여부 기반 페이지네이션
- **UI/Client State:** `Zustand`로 경량 상태. 예: 선택 상태 [features/course-select/model/useCourseSelect.ts](src/features/course-select/model/useCourseSelect.ts), 배치 결과 [features/enroll-course/model/useEnrollStore.ts](src/features/enroll-course/model/useEnrollStore.ts), 인증 상태 [features/auth/model/useAuthStore.ts](src/features/auth/model/useAuthStore.ts).
- **분리의 이점:** 서버/클라이언트 상태 분리로 캐시 무결성 유지, 컴포넌트 로컬 상호작용 단순화, 테스트 용이성 향상.

## 라우팅/권한

- **권한 가드:** [middleware.ts](middleware.ts)에서 `/instructor/*` 접근 시 `role` 쿠키를 검증하여 `/sign-in` 또는 `/courses`로 리다이렉트.
- **역할 저장:** 로그인/회원가입 후 [features/auth/model/useAuthStore.ts](src/features/auth/model/useAuthStore.ts)에서 `role`을 쿠키/스토어에 저장·동기화.
- **URL 상태:** 정렬 등은 URL 쿼리로 유지. [features/course-filter/ui/SortSelect.tsx](src/features/course-filter/ui/SortSelect.tsx)에서 `router.replace`로 스크롤 보존.

## 데이터 흐름/페칭

- **중앙 페처:** [shared/api/fetcher.ts](src/shared/api/fetcher.ts)에서 `NEXT_PUBLIC_API_BASE_URL` 검증, 에러 파싱, 401(A003) 토큰 만료 공통 처리.
- **도메인 API:** 강의 목록 [entities/course/api/fetchCourses.ts](src/entities/course/api/fetchCourses.ts), 강의 생성 [entities/course/api/createCourse.ts](src/entities/course/api/createCourse.ts), 배치 수강 [entities/enrollment/api/enrollBatchAPI.ts](src/entities/enrollment/api/enrollBatchAPI.ts) 등은 중앙 페처를 사용.
- **배치 응답 처리:** [features/enroll-course/model/enrollBatch.ts](src/features/enroll-course/model/enrollBatch.ts)에서 성공/실패를 구분 저장 후 완료 페이지로 이동.

## 무한 스크롤 구현

- **IntersectionObserver 훅:** [shared/lib/useIntersection.ts](src/shared/lib/useIntersection.ts)
  - `rootMargin: "100px"`로 미리 로딩하여 지연 감소
  - `entry.isIntersecting` 시점에 `fetchNextPage()` 트리거
- **Sentinel 패턴:** [widgets/course-list/CourseList.tsx](src/widgets/course-list/CourseList.tsx) 하단 `li`에 ref 부착하여 스크롤 도달을 감지.
- **에러/로딩 UI:** 동일 컴포넌트에서 재시도 버튼/로딩 상태를 명확히 표시.

## 에러/예외 처리 설계

- **에러 타입:** [shared/lib/errors/errorTypes.ts](src/shared/lib/errors/errorTypes.ts)에서 `ApiError`로 `status`, `code`, `fieldErrors`를 구조화.
- **필드 매핑:** [shared/lib/errors/errorMessages.ts](src/shared/lib/errors/errorMessages.ts)의 `parseApiError`로 서버 메시지를 폼 필드에 연결(예: [features/create-course/ui/CreateCourseForm.tsx](src/features/create-course/ui/CreateCourseForm.tsx), [features/auth/ui/SignUpForm.tsx](src/features/auth/ui/SignUpForm.tsx)).
- **토큰 만료 공통 처리:** [shared/api/fetcher.ts](src/shared/api/fetcher.ts)에서 `401 + A003` 시 쿠키 삭제, 알림, `/sign-in` 리다이렉트.

## 성능/UX 고려

- **캐시 전략:** `staleTime`과 쿼리키 일관화로 불필요한 네트워크 최소화.
- **부분 성공 UX:** 배치 수강에서 성공/실패 항목을 분리해 재시도 경로 제공([features/enroll-course/model/enrollBatch.ts](src/features/enroll-course/model/enrollBatch.ts)).
- **접근성:** 로딩/상태 섹션에 `role`, `aria-live`를 지정하여 스크린리더 피드백 개선([widgets/course-list/CourseList.tsx](src/widgets/course-list/CourseList.tsx)).
