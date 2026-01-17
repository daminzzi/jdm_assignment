// 범용 에러 응답 파싱 함수
export function parseApiError(
  errorResponse: any,
  fieldExtractor?: (message: string, code: string) => string | null
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (errorResponse === null) return fieldErrors;

  // 에러 응답이 배열인 경우 (여러 필드 에러)
  if (Array.isArray(errorResponse)) {
    errorResponse.forEach((error: any) => {
      const code = error.code || "UNKNOWN";
      const message = error.message || "요청 처리 중 오류가 발생했습니다";

      // 커스텀 필드 추출 함수가 있으면 사용
      if (fieldExtractor) {
        const field = fieldExtractor(message, code);
        if (field) {
          fieldErrors[field] = message;
        }
      }
    });
  }
  // 단일 객체인 경우
  else if (typeof errorResponse === "object") {
    const code = errorResponse.code || "UNKNOWN";
    const message = errorResponse.message || "요청 처리 중 오류가 발생했습니다";

    // 커스텀 필드 추출 함수가 있으면 사용
    if (fieldExtractor) {
      const field = fieldExtractor(message, code);
      if (field) {
        fieldErrors[field] = message;
      }
    }
  }

  return fieldErrors;
}
