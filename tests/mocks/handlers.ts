import { http, HttpResponse } from 'msw';

const baseUrl = 'http://localhost:8080';

// === Auth Handlers ===
const authHandlers = {
  signInSuccess: http.post(`${baseUrl}/api/users/login`, () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token-123',
      tokenType: 'Bearer',
      user: {
        id: 1,
        email: 'student@example.com',
        name: '학생',
        phone: '010-0000-0000',
        role: 'STUDENT',
      },
    });
  }),

  signInNotFound: http.post(`${baseUrl}/api/users/login`, () => {
    return HttpResponse.json(
      {
        status: 404,
        code: 'U002',
        message: '사용자를 찾을 수 없습니다',
      },
      { status: 404 }
    );
  }),

  signInPasswordMismatch: http.post(`${baseUrl}/api/users/login`, () => {
    return HttpResponse.json(
      {
        status: 401,
        code: 'U003',
        message: '비밀번호가 일치하지 않습니다',
      },
      { status: 401 }
    );
  }),

  signInValidationError: http.post(`${baseUrl}/api/users/login`, () => {
    return HttpResponse.json(
      {
        status: 400,
        code: 'G001',
        message: '이메일 형식이 올바르지 않습니다',
      },
      { status: 400 }
    );
  }),

  signUpSuccess: http.post(`${baseUrl}/api/users/signup`, () => {
    return HttpResponse.json({
      id: 2,
      email: 'newuser@example.com',
      name: '새 사용자',
      phone: '010-1111-1111',
      role: 'STUDENT',
      message: '회원가입이 완료되었습니다',
    });
  }),

  signUpEmailDuplicate: http.post(`${baseUrl}/api/users/signup`, () => {
    return HttpResponse.json(
      {
        status: 409,
        code: 'U001',
        message: '이미 사용 중인 이메일입니다',
      },
      { status: 409 }
    );
  }),

  signUpValidationError: http.post(`${baseUrl}/api/users/signup`, () => {
    return HttpResponse.json(
      {
        status: 400,
        code: 'G001',
        message: '비밀번호는 최소 8자 이상이어야 합니다',
      },
      { status: 400 }
    );
  }),

  tokenExpired: http.post(`${baseUrl}/api/users/login`, () => {
    return HttpResponse.json(
      {
        status: 401,
        code: 'A003',
        message: '인증이 만료되었습니다',
      },
      { status: 401 }
    );
  }),
};

// === Course Handlers ===
const courseHandlers = {
  fetchCoursesSuccess: http.get(`${baseUrl}/api/courses`, () => {
    return HttpResponse.json({
      content: [
        {
          id: 1,
          title: '프론트엔드 기초',
          instructorName: '강사 A',
          maxStudents: 30,
          currentStudents: 25,
          availableSeats: 5,
          isFull: false,
          price: 50000,
          createdAt: '2024-01-10T10:00:00Z',
        },
        {
          id: 2,
          title: '백엔드 심화',
          instructorName: '강사 B',
          maxStudents: 20,
          currentStudents: 20,
          availableSeats: 0,
          isFull: true,
          price: 80000,
          createdAt: '2024-01-09T10:00:00Z',
        },
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
      },
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
    });
  }),

  fetchCoursesError: http.get(`${baseUrl}/api/courses`, () => {
    return HttpResponse.json(
      {
        status: 500,
        code: 'SERVER_ERROR',
        message: '서버 오류가 발생했습니다',
      },
      { status: 500 }
    );
  }),

  createCourseSuccess: http.post(`${baseUrl}/api/courses`, () => {
    return HttpResponse.json({
      id: 10,
      title: '새 강의',
      description: '강의 설명',
      instructorName: '강사 C',
      maxStudents: 50,
      currentStudents: 0,
      availableSeats: 50,
      isFull: false,
      price: 100000,
      createdAt: '2024-01-15T10:00:00Z',
    });
  }),

  createCourseUnauthorized: http.post(`${baseUrl}/api/courses`, () => {
    return HttpResponse.json(
      {
        status: 401,
        code: 'A003',
        message: '인증이 필요합니다',
      },
      { status: 401 }
    );
  }),

  createCourseForbidden: http.post(`${baseUrl}/api/courses`, () => {
    return HttpResponse.json(
      {
        status: 403,
        code: 'C003',
        message: '강사만 강의를 등록할 수 있습니다',
      },
      { status: 403 }
    );
  }),
};

// === Enrollment Handlers ===
const enrollmentHandlers = {
  enrollBatchSuccess: http.post(`${baseUrl}/api/enrollments/batch`, () => {
    return HttpResponse.json({
      success: [
        {
          courseId: 1,
          enrollmentId: 101,
        },
        {
          courseId: 2,
          enrollmentId: 102,
        },
      ],
      failed: [],
    });
  }),

  enrollBatchPartialSuccess: http.post(`${baseUrl}/api/enrollments/batch`, () => {
    return HttpResponse.json({
      success: [
        {
          courseId: 1,
          enrollmentId: 101,
        },
      ],
      failed: [
        {
          courseId: 2,
          reason: '정원이 가득 찼습니다',
        },
      ],
    });
  }),

  enrollBatchUnauthorized: http.post(`${baseUrl}/api/enrollments/batch`, () => {
    return HttpResponse.json(
      {
        status: 401,
        code: 'A003',
        message: '인증이 필요합니다',
      },
      { status: 401 }
    );
  }),

  enrollBatchAllFailure: http.post(`${baseUrl}/api/enrollments/batch`, () => {
    return HttpResponse.json({
      success: [],
      failed: [
        {
          courseId: 1,
          reason: '정원이 가득 찼습니다',
        },
        {
          courseId: 2,
          reason: '이미 등록된 강의입니다',
        },
      ],
    });
  }),
};

// Export handler groups
export const mockHandlers = {
  auth: authHandlers,
  course: courseHandlers,
  enrollment: enrollmentHandlers,
};

// Default handlers (success cases)
export const handlers = [
  authHandlers.signInSuccess,
  authHandlers.signUpSuccess,
  courseHandlers.fetchCoursesSuccess,
  courseHandlers.createCourseSuccess,
  enrollmentHandlers.enrollBatchSuccess,
];
