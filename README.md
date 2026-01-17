# JDM Assignment — 강의 플랫폼 프론트엔드

## 1. 프로젝트 개요 (Overview)

- 모바일 웹 기반 강의 플랫폼
- 핵심 사용자 흐름: 강의 탐색 → 선택 → 수강 신청
- 강사 전용 강의 등록 기능 포함
- UX 일관성, 상태 분리, 권한 제어에 집중 (설계 의도 중심)

## 2. 기술 스택 (Tech Stack)

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (Server State)
- Zustand (Client/UI State)
- Slim FSD (Feature-Sliced Design)

기술 선택 이유 및 트레이드오프는 [docs/DECISIONS.md](docs/DECISIONS.md) 참고

## 3. 실행 방법 (Getting Started)

아래 커맨드는 로컬에서 바로 실행 가능하도록 최소화되어 있습니다.

### 3.1 의존성 설치

```bash
npm install
```

### 3.2 환경 변수 (선택)

실제 백엔드 연동 시에만 필요합니다. 데모/목업 실행에는 필수가 아닙니다.

파일: `.env.local`

```bash
# 예시: 백엔드 API 베이스 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3.3 개발 서버 실행

```bash
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

### 3.4 테스트 실행

```bash
npm run test
```

### 3.5 Mock API

테스트 환경에서는 MSW(Mock Service Worker)를 사용하여 API를 모킹합니다.

## 4. 전체 기능 요약 (Features Overview)

- 강의 목록
  - 무한 스크롤
  - 정렬
  - 다중 선택
- 수강 신청
  - 선택 강의 최종 확인
  - 배치 수강 신청(부분 성공 지원)
- 강사 기능
  - 강의 등록 (권한 제어)

기능별 상세 UX/흐름은 [docs/FEATURES.md](docs/FEATURES.md) 참고

## 5. 핵심 설계 포인트 (Key Design Points)

- 서버 상태(`TanStack Query`)와 UI 상태(`Zustand`)를 분리하여 예측 가능성 확보
- URL 기반 상태 관리로 재방문/직접 접근 상황에서 UX 안정성 유지
- `middleware`를 통한 권한 제어와 라우팅 보호
- 실패/부분 성공을 명확히 드러내는 수강 신청 UX 설계

구조/상태/라우팅 설계 상세는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고

## 6. 에러 & 엣지 케이스 처리 (간략 요약)

- 강의 목록 API 실패 시 사용자 친화적 오류 노출
- 무한 스크롤 중 로딩 실패 재시도/중단 처리
- 인증/권한 오류 발생 시 리다이렉션 및 안내
- 직접 URL 접근 시 적절한 가드 적용

상세 처리 방식은 [docs/EDGE_CASES.md](docs/EDGE_CASES.md) 참고

## 7. 문서 구조 안내 (Documentation)

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) : 구조 및 상태/라우팅 설계
- [docs/FEATURES.md](docs/FEATURES.md) : 기능별 UX/흐름 상세
- [docs/EDGE_CASES.md](docs/EDGE_CASES.md) : 에러/예외 처리
- [docs/DECISIONS.md](docs/DECISIONS.md) : 기술 선택 이유와 트레이드오프

## 8. 개선 여지 / 아쉬운 점

- 테스트: e2e 확장 및 실패 케이스 시나리오 추가
- 접근성: 키보드 내비게이션/스크린리더 레이블 강화
- UI polish: 트랜지션/상태 표시 마이크로 인터랙션 보강
