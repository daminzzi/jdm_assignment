import { ApiError } from "@/shared/lib";

export const COURSE_ERROR_MESSAGES: Record<string, { message: string; field?: string }> = {
  G001: { message: "입력값이 올바르지 않습니다" }, // Generic validation error
  A003: { message: "인증이 필요합니다" },
  C003: { message: "강사만 강의를 등록할 수 있습니다" },
};

export function extractCourseFieldFromMessage(message: string, code: string): string | null {
  // 특정 필드 에러 메시지 분석
  if (message.includes("제목")) return "title";
  if (message.includes("강사")) return "instructorName";
  if (message.includes("수강 인원")) return "maxStudents";
  if (message.includes("수강료")) return "price";
  if (message.includes("설명")) return "description";

  return null;
}

export function getCourseErrorMessage(code: string): string {
  return COURSE_ERROR_MESSAGES[code]?.message || "요청 실패. 다시 시도해주세요";
}
