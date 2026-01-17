"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/shared/lib";
import InputField from "./InputField";
import { signIn } from "../model/signInAPI";
import { signInSchema, type SignInFormData } from "../model/signInSchema";
import { useAuthStore } from "../model/useAuthStore";

export default function SignInForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setApiError("");
    setLoading(true);

    try {
      const response = await signIn(data);

      // 토큰과 사용자 정보 저장
      setAuth(response.accessToken, response.user);

      // 메인 페이지로 이동
      router.push("/courses");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          Object.entries(err.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof SignInFormData, {
              type: "manual",
              message,
            });
          });
        }
        setApiError(err.message);
      } else {
        setApiError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{apiError}</div>}

      <InputField
        label="이메일"
        placeholder="you@example.com"
        type="email"
        register={register("email")}
        error={errors.email?.message}
      />

      <InputField
        label="패스워드"
        placeholder="••••••••"
        type="password"
        register={register("password")}
        error={errors.password?.message}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <button
        type="button"
        className="w-full rounded-md border px-4 py-2"
        onClick={() => router.push("/sign-up")}>
        회원가입
      </button>
    </form>
  );
}
