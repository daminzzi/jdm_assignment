# DECISIONS

기술 선택 이유와 트레이드오프를 실제 구현 맥락과 함께 요약합니다.

## Next.js (App Router)

- **이유:** 파일 기반 라우팅/레이아웃, `middleware`로 경로 보호([middleware.ts](middleware.ts)). App Router의 서버/클라이언트 경계를 통해 컴포넌트 성능/보안 이점.
- **트레이드오프:** 서버/클라이언트 구분과 데이터 흐름 이해가 필요. 미들웨어/쿠키 기반 권한 제어의 테스트 난이도.

## TypeScript

- **이유:** 도메인 타입 안정성과 API 계약 명세화(예: [entities/course/model/types.ts](src/entities/course/model/types.ts), [entities/enrollment/model/types.ts](src/entities/enrollment/model/types.ts)).
- **트레이드오프:** 초기 타입 정의 비용, 폼 변환(`valueAsNumber`) 등 세심함 요구.

## Tailwind CSS

- **이유:** 빠른 UI 작업과 디자인 토큰 일관성. 접근성 속성 추가 시 스타일 유지가 간단.
- **트레이드오프:** 클래스 과밀/가독성 이슈 가능, 컴포넌트 규칙 합의 필요.

## TanStack Query

- **이유:** 캐시/로딩/에러 표준화, 무한 스크롤 지원([widgets/course-list/useCoursesQuery.ts](src/widgets/course-list/useCoursesQuery.ts)). `staleTime`과 `getNextPageParam`으로 예측 가능 페칭.
- **트레이드오프:** 캐시 키/라이프사이클 설계 복잡. 전역 무효화 전략 주의 필요.

## Zustand

- **이유:** 경량 UI 상태에 적합(선택/배치 결과/인증 등). [features/course-select/model/useCourseSelect.ts](src/features/course-select/model/useCourseSelect.ts), [features/enroll-course/model/useEnrollStore.ts](src/features/enroll-course/model/useEnrollStore.ts), [features/auth/model/useAuthStore.ts](src/features/auth/model/useAuthStore.ts).
- **트레이드오프:** 전역 남용 위험, 구조화/네이밍 규칙 필요.

## Slim FSD

- **이유:** 도메인/기능/조합 레이어 분리로 변경 용이성/테스트 용이성 향상. 코드 재사용 경로 명확화.
- **트레이드오프:** 초기 디렉토리 분류 비용, 작은 프로젝트에서는 과설계 우려.

## Radix UI

- **이유:** 접근성 고려된 컴포넌트(예: 정렬 셀렉트 [features/course-filter/ui/SortSelect.tsx](src/features/course-filter/ui/SortSelect.tsx)).
- **트레이드오프:** 스타일 커스터마이즈 비용, 번들 크기 고려.

## MSW + Vitest

- **이유:** 네트워크 의존 없이 API/에러 시나리오 검증([tests/shared/api/fetcher.test.ts](tests/shared/api/fetcher.test.ts), [tests/widgets/course-list/useCoursesQuery.test.ts](tests/widgets/course-list/useCoursesQuery.test.ts)). 부분 성공/401 만료 등 재현 용이.
- **트레이드오프:** 실제 백엔드와의 차이를 주기적으로 점검 필요, 핸들러 유지 비용.
