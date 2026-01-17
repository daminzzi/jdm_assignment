const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ErrorResponse {
  status: number;
  code?: string;
  message?: string;
  [key: string]: any;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let errorData: ErrorResponse = {
      status: res.status,
      message: `API Error ${res.status}`,
    };

    try {
      errorData = { ...errorData, ...(await res.json()) };
    } catch {
      const text = await res.text().catch(() => "");
      errorData.message = text || `API Error ${res.status}`;
    }

    // 401 A003 토큰 만료 처리
    if (res.status === 401 && errorData.code === "A003") {
      // 쿠키 삭제
      if (typeof document !== "undefined") {
        document.cookie = "role=; path=/; max-age=0";
      }
      
      // 사용자에게 알림
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      
      // /sign-in으로 리다이렉트
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }

    const error = new Error(errorData.message || `API Error ${res.status}`);
    (error as any).response = errorData;
    throw error;
  }

  return (await res.json()) as T;
}
