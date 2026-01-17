import { apiFetch } from "@/shared/api";
import type { SignUpFormData } from "./signUpSchema";
import { ApiError, parseApiError } from "@/shared/lib";
import { extractAuthFieldFromMessage } from "./authErrors";

export interface SignUpResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
  message: string;
}

export interface SignUpErrorResult {
  globalError?: string;
  fieldErrors: Record<string, string>;
}

export async function signUp(data: SignUpFormData): Promise<SignUpResponse> {
  try {
    return await apiFetch<SignUpResponse>("/api/users/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    // 에러 응답 파싱
    const errorResponse = error?.response || error;
    const code = errorResponse.code || "UNKNOWN";
    const status = errorResponse.status || 400;

    // 필드별 에러 추출 (auth 도메인 특화 필드 추출 함수 사용)
    const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

    // ApiError 생성
    throw new ApiError({
      status,
      code,
      message: errorResponse.message || "회원가입에 실패했습니다",
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    });
  }
}
