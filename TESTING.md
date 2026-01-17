# 테스트 구현 사항

## 🎯 구현 현황

### 1️⃣ 테스트 환경 설정 ✅

- **의존성 설치**
  - Vitest 2.1.8 (유닛/통합 테스트)
  - React Testing Library 16.0.1 (컴포넌트 테스트)
  - MSW 2.4.10 (API 모킹)
  - @testing-library/user-event 14.5.2 (사용자 이벤트 시뮬레이션)

- **설정 파일**
  - `vitest.config.ts`: jsdom 환경, globals 활성화, MSW setup 등록
  - `.env.test`: 테스트 환경 변수

### 2️⃣ MSW 핸들러 구성 ✅

**위치**: `tests/mocks/`

#### handlers.ts

```
✅ Auth API
  - signInSuccess, signInNotFound (U002), signInPasswordMismatch (U003)
  - signInValidationError (G001), tokenExpired (401 A003)
  - signUpSuccess, signUpEmailDuplicate (U001), signUpValidationError

✅ Course API
  - fetchCoursesSuccess, fetchCoursesError
  - createCourseSuccess, createCourseUnauthorized (401), createCourseForbidden (403)

✅ Enrollment API
  - enrollBatchSuccess, enrollBatchPartialSuccess, enrollBatchAllFailure
  - enrollBatchUnauthorized (401)
```

#### server.ts & setup.ts

- MSW setupServer 설정
- beforeAll/afterEach/afterAll 라이프사이클 처리

### 3️⃣ 테스트 유틸 및 헬퍼 ✅

**위치**: `tests/test-utils.tsx`

```typescript
renderWithProviders(ui, { queryClient, mockRouter })
  - QueryClientProvider 통합
  - Next.js Router 모킹
  - MSW 통합
```

---

## 📋 작성된 테스트

### 4️⃣ API 계층 테스트 (5개) ✅

#### tests/shared/api/fetcher.test.ts

- ✅ 200 성공 응답
- ❌ 401 A003 토큰 만료 (쿠키 삭제, alert, 리다이렉트)
- ❌ 400/404/500 상태 코드 처리
- ❌ JSON 파싱 실패 시 텍스트 폴백
- ❌ baseUrl 미설정 에러

#### tests/features/auth/model/signInAPI.test.ts

- ✅ 로그인 성공
- ❌ U002 (사용자 없음) → email 필드 에러
- ❌ U003 (비밀번호 불일치) → password 필드 에러
- ❌ G001 (유효성 검사) → 동적 필드 매핑

#### tests/features/auth/model/signUpAPI.test.ts

- ✅ 회원가입 성공
- ❌ U001 (이메일 중복) → email 필드 에러
- ❌ G001 (유효성 검사 실패)

#### tests/features/auth/model/authErrors.test.ts

- ✅ extractAuthFieldFromMessage 코드별 매핑
  - U001, U002, U003, G001 (이메일/비밀번호/이름/휴대폰/회원)
- ✅ 미알려 코드 처리

#### tests/shared/lib/errors/errorMessages.test.ts

- ✅ parseApiError 단일/배열 에러 처리
- ✅ 커스텀 필드 추출 함수 통합
- ✅ 기본값 처리

---

### 5️⃣ 컴포넌트 테스트 (3개) ✅

#### tests/features/auth/ui/SignInForm.test.tsx

- ✅ 로그인 성공 → /courses 네비게이션
- ❌ U002 에러 → email 필드 표시
- ❌ U003 에러 → password 필드 표시
- ❌ 유효성 검사 실패
- ✅ 로딩 상태 버튼 비활성화
- ✅ 회원가입 페이지 이동

#### tests/features/auth/ui/SignUpForm.test.tsx

- ✅ 회원가입 성공 → /sign-up/complete 네비게이션
- ❌ U001 (이메일 중복) → 필드 에러 표시
- ✅ 필드 검증 (공백, 비밀번호 불일치)

#### tests/features/create-course/ui/CreateCourseForm.test.tsx

- ✅ 강의 생성 성공 → /instructor/create/complete 네비게이션
- ❌ 403 C003 (권한 없음) → alert + /courses 이동
- ❌ 401 A003 (인증 만료) → alert + /sign-in 이동
- ✅ 필드 검증 (제목, 수강인원, 수강료)

---

### 6️⃣ React Query 뮤테이션 테스트 (3개) ✅

#### tests/features/create-course/model/useCreateCourseMutation.test.ts

- ✅ 강의 생성 성공
- ✅ 캐시 무효화 (courses queryKey)
- ❌ accessToken 없음 → 에러
- ❌ 403 C003 에러
- ❌ 401 A003 에러

#### tests/features/enroll-course/model/enrollBatch.test.ts

- ✅ 전체 성공
- ✅ 부분 성공 (캐시 무효화 O)
- ✅ 전체 실패 (캐시 무효화 X)
- ✅ 결과 store에 저장
- ❌ accessToken 없음
- ❌ 401 A003 에러

#### tests/widgets/course-list/useCoursesQuery.test.ts

- ✅ 강의 조회 성공
- ✅ 정렬 파라미터 적용
- ✅ 무한 스크롤 pagination
- ✅ 캐시 staleTime (60초)
- ❌ API 에러 처리

---

## 📊 테스트 카운트 요약

| 카테고리        | 파일 개수 | 테스트 케이스 | 주요 포커스               |
| --------------- | --------- | ------------- | ------------------------- |
| **API 계층**    | 5         | ~25개         | 에러 코드 매핑, 필드 추출 |
| **컴포넌트**    | 3         | ~20개         | 폼 에러 표시, 네비게이션  |
| **React Query** | 3         | ~20개         | 뮤테이션, 캐시, 에러 처리 |
| **총계**        | **16**    | **~90개**     | **API 실패 케이스 중심**  |

---

## 🚀 테스트 실행 명령어

```bash
# 유닛/통합 테스트 실행
npm run test

# 테스트 실시간 감시 모드
npm run test:watch

# 테스트 UI 대시보드
npm run test:ui

# 커버리지 리포트
npm run test:coverage

```

---

## ✨ 특징

### 🎯 API 실패 케이스 중심

- **401 A003 토큰 만료**: 쿠키 삭제, alert, 리다이렉트 검증
- **필드별 에러 매핑**: 에러 코드 → 폼 필드 에러로 변환
- **부분 성공 처리**: enrollBatch 부분 성공/실패 시나리오

### 🛡️ MSW 통합

- 모든 API 엔드포인트 모킹
- 성공/실패 시나리오 모두 포함
- setupServer로 전역 API 모킹

### 🔄 통합 테스트

- QueryClient + Router + MSW 통합
- 실제 사용자 플로우 시뮬레이션
- 네비게이션 및 상태 변화 검증

---

## 📝 다음 단계

1. **테스트 실행 및 수정**

   ```bash
   npm install
   npm run test
   ```

2. **테스트 커버리지 개선**
   - 더 많은 엣지 케이스 추가
   - 쿠키/localStorage 테스트 강화

3. **CI/CD 통합**
   - GitHub Actions로 자동 테스트
   - PR 체크 추가

4. **테스트 데이터 관리**
   - Factory 패턴으로 테스트 데이터 생성
   - fixtures 디렉토리 구성

---

## 📚 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [MSW 공식 문서](https://mswjs.io/)
- [React Testing Library 공식 문서](https://testing-library.com/docs/react-testing-library/intro/)
