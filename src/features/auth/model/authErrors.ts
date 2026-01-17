// Auth 도메인 특화 에러 메시지 및 필드 매핑
export const AUTH_ERROR_MESSAGES: Record<string, { message: string; field?: string }> = {
  "G001": {
    message: "입력값이 올바르지 않습니다",
  },
  "U001": {
    message: "이미 사용 중인 이메일입니다",
    field: "email",
  },
  "U002": {
    message: "사용자를 찾을 수 없습니다",
    field: "email",
  },
  "U003": {
    message: "비밀번호가 일치하지 않습니다",
    field: "password",
  },
};

// Auth 필드명 추출 함수
export function extractAuthFieldFromMessage(message: string, code: string): string | null {
  // U001 - 이메일 중복
  if (code === "U001") {
    return "email";
  }

  // U002 - 사용자 없음
  if (code === "U002") {
    return "email";
  }

  // U003 - 비밀번호 불일치
  if (code === "U003") {
    return "password";
  }

  // G001 - 유효성 검사 에러 (메시지에서 필드 추출)
  if (code === "G001") {
    const fieldMap: Record<string, string> = {
      이메일: "email",
      비밀번호: "password",
      이름: "name",
      휴대폰: "phone",
      회원: "role",
    };

    for (const [keyword, field] of Object.entries(fieldMap)) {
      if (message.includes(keyword)) {
        return field;
      }
    }
  }

  return null;
}
