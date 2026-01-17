# FEATURES

기능별 UX/흐름과 핵심 구현 포인트를 정리합니다. 각 항목은 상세 문서와 연결됩니다.

## 강의 목록

- **무한 스크롤:** [widgets/course-list/CourseList.tsx](src/widgets/course-list/CourseList.tsx)에서 하단 sentinel을 [shared/lib/useIntersection.ts](src/shared/lib/useIntersection.ts)에 연결하여 `hasNextPage && !isFetchingNextPage` 조건에만 `fetchNextPage()`를 호출합니다.
- **정렬:** [features/course-filter/ui/SortSelect.tsx](src/features/course-filter/ui/SortSelect.tsx)에서 `router.replace`로 `sort`를 URL에 반영하고, 쿼리키 `["courses", { sort }]`로 캐시를 분리합니다.
- **다중 선택:** [entities/course/ui/CourseCard.tsx](src/entities/course/ui/CourseCard.tsx)에서 카드 클릭 시 [features/course-select/model/useCourseSelect.ts](src/features/course-select/model/useCourseSelect.ts)로 토글합니다. footer 바 [widgets/footer-enroll-bar/FooterEnrollBar.tsx](src/widgets/footer-enroll-bar/FooterEnrollBar.tsx)가 선택 상태를 요약 표시합니다.

## 수강 신청

- **최종 확인:** [widgets/enroll-summary/EnrollSummary.tsx](src/widgets/enroll-summary/EnrollSummary.tsx)에서 선택 강의를 Query 캐시에서 매핑해 금액 합계/잔여석을 표시합니다.
- **배치 신청:** [features/enroll-course/model/enrollBatch.ts](src/features/enroll-course/model/enrollBatch.ts) + [entities/enrollment/api/enrollBatchAPI.ts](src/entities/enrollment/api/enrollBatchAPI.ts)로 요청을 수행, 응답의 `success`/`failed`를 저장한 후 `/enroll/complete`로 이동합니다.
- **부분 성공 UX:** 완료 페이지에서 성공/실패를 구분하여 재시도 안내(상태는 [features/enroll-course/model/useEnrollStore.ts](src/features/enroll-course/model/useEnrollStore.ts)). 성공이 있을 경우 강의 캐시 무효화로 정원 반영.

## 강사 기능

- **강의 등록:** 폼은 [features/create-course/ui/CreateCourseForm.tsx](src/features/create-course/ui/CreateCourseForm.tsx), 제출은 [features/create-course/model/useCreateCourseMutation.ts](src/features/create-course/model/useCreateCourseMutation.ts) → [entities/course/api/createCourse.ts](src/entities/course/api/createCourse.ts).
- **폼 검증:** Zod 스키마 [features/create-course/model/createCourseSchema.ts](src/features/create-course/model/createCourseSchema.ts)와 서버 필드 에러를 `ApiError.fieldErrors`로 매핑하여 `react-hook-form.setError`로 표기.
- **권한 제어:** 비인증/비강사 에러 코드에 따라 라우팅 처리(예: `A003` 토큰 만료는 [shared/api/fetcher.ts](src/shared/api/fetcher.ts), `C003` 권한 오류는 뮤테이션 `onError`).

## 인증

- **회원가입/로그인:** 응답 성공 시 [features/auth/model/useAuthStore.ts](src/features/auth/model/useAuthStore.ts)가 `role` 쿠키와 스토어를 동기화합니다. 회원가입 폼의 서버 필드 에러는 [features/auth/ui/SignUpForm.tsx](src/features/auth/ui/SignUpForm.tsx)에서 `ApiError` 기반으로 각 필드에 반영합니다.

추가 흐름/세부 UX는 [ARCHITECTURE.md](ARCHITECTURE.md) 및 [EDGE_CASES.md](EDGE_CASES.md)에서 보완합니다.
