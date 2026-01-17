# EDGE_CASES

에러/엣지 케이스를 “처리 위치 / 핵심 로직 / 이점” 기준으로 정리합니다.

## 1) 강의 목록 API 실패

- **처리 위치:** [widgets/course-list/CourseList.tsx](src/widgets/course-list/CourseList.tsx)
- **핵심 로직:** `useCoursesQuery`가 `isError`일 때 경고 박스와 `refetch()` 버튼 제공. 무한 스크롤은 `hasNextPage && !isFetchingNextPage`에서만 다음 페이지 요청해 중복 호출 방지.
- **이점:** 즉시 재시도 경로 제공 + 불필요한 네트워크 요청 억제로 안정적 UX.

## 2) 무한 스크롤 중 로딩 실패/중복 요청

- **처리 위치:** [shared/lib/useIntersection.ts](src/shared/lib/useIntersection.ts), [widgets/course-list/CourseList.tsx](src/widgets/course-list/CourseList.tsx)
- **핵심 로직:** IntersectionObserver의 `rootMargin: 100px`로 미리 로드, `isFetchingNextPage` 가드로 중복 호출 방지.
- **이점:** 스크롤 지점에서 끊김 없는 로딩과 네트워크 효율성 보장.

## 3) 인증 토큰 만료(401 / A003)

- **처리 위치:** [shared/api/fetcher.ts](src/shared/api/fetcher.ts)
- **핵심 로직:** 응답 파싱 후 `status===401 && code==='A003'`이면 `role` 쿠키 삭제, 경고(alert), `/sign-in`으로 리다이렉트.
- **이점:** 공통 경로에서 세션 만료를 일관 처리하여 기능별 중복 코드를 제거.

## 4) 권한 오류(강의 등록 등)

- **처리 위치:** [features/create-course/model/useCreateCourseMutation.ts](src/features/create-course/model/useCreateCourseMutation.ts)
- **핵심 로직:** `onError`에서 권한 코드(`C003`)를 감지해 안내 후 `/courses`로 이동. 토큰 만료는 공통 처리(`A003`).
- **이점:** 사용자에게 명확한 피드백과 안전한 폴백 라우팅 제공.

## 5) 회원가입/강의 등록 폼 필드 에러

- **처리 위치:** [features/auth/ui/SignUpForm.tsx](src/features/auth/ui/SignUpForm.tsx), [features/create-course/ui/CreateCourseForm.tsx](src/features/create-course/ui/CreateCourseForm.tsx)
- **핵심 로직:** 서버에서 온 `ApiError.fieldErrors`를 `react-hook-form.setError`로 매핑. 필요 시 [shared/lib/errors/errorMessages.ts](src/shared/lib/errors/errorMessages.ts)의 `parseApiError`로 필드 추출.
- **이점:** 정확한 필드 별 피드백으로 재입력 비용과 좌절감 감소.

## 6) 환경 설정 누락(NEXT_PUBLIC_API_BASE_URL)

- **처리 위치:** [shared/api/fetcher.ts](src/shared/api/fetcher.ts), 테스트 [tests/shared/api/fetcher.test.ts](tests/shared/api/fetcher.test.ts)
- **핵심 로직:** 베이스 URL 미설정 시 즉시 예외 throw(테스트로 검증됨). 네트워크 호출 전 빠르게 실패.
- **이점:** 설정 오류를 조기에 발견하여 디버깅 비용 절감.

## 7) 직접 URL 접근(정렬/선택 상태)

- **처리 위치:** 정렬 [features/course-filter/ui/SortSelect.tsx](src/features/course-filter/ui/SortSelect.tsx), 선택 [features/course-select/model/useCourseSelect.ts](src/features/course-select/model/useCourseSelect.ts)
- **핵심 로직:** 정렬은 URL에서 기본값(`recent`)을 사용하고, 선택은 미존재 시 비어있는 상태로 안전하게 초기화.
- **이점:** 재방문/공유 링크 안정성, 예측 가능한 초기 상태 제공.

## 8) 배치 수강 신청 부분 성공

- **처리 위치:** [features/enroll-course/model/enrollBatch.ts](src/features/enroll-course/model/enrollBatch.ts)
- **핵심 로직:** 응답의 `success`와 `failed`를 저장 후 완료 페이지로 이동. 성공 항목이 있으면 `courses` 캐시 무효화.
- **이점:** 실패를 숨기지 않고 명확히 전달, 데이터 일관성 유지.

---

테스트 케이스로 일부 동작을 검증합니다:

- API 페처 에러/토큰 만료: [tests/shared/api/fetcher.test.ts](tests/shared/api/fetcher.test.ts)
- 강의 목록 쿼리/페이지네이션/에러 상태: [tests/widgets/course-list/useCoursesQuery.test.ts](tests/widgets/course-list/useCoursesQuery.test.ts)
