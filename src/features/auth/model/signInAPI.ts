import { apiFetch } from "@/shared/api";
import { ApiError, parseApiError } from "@/shared/lib";
import { extractAuthFieldFromMessage } from "./authErrors";
import type { SignInFormData } from "./signInSchema";

export interface SignInResponse {
  accessToken: string;
  tokenType: "Bearer";
  user: {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: "STUDENT" | "INSTRUCTOR";
  };
}

export async function signIn(data: SignInFormData): Promise<SignInResponse> {
  try {
    return await apiFetch<SignInResponse>("/api/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    const errorResponse = error?.response || error;
    const code = errorResponse.code || "UNKNOWN";
    const status = errorResponse.status || 401;

    const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

    throw new ApiError({
      status,
      code,
      message: errorResponse.message || "로그인에 실패했습니다",
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    });
  }
}
