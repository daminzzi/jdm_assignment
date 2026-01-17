"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import RadioField from "./RadioField";
import { signUp } from "../model/signUpAPI";
import { signUpSchema, type SignUpFormData } from "../model/signUpSchema";
import { useAuthStore } from "../model/useAuthStore";
import { ApiError } from "@/shared/lib";

export default function SignUpForm() {
  const router = useRouter();
  const { setRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: SignUpFormData) => {
    setApiError("");
    setLoading(true);

    try {
      await signUp(data);

      // 회원가입 성공
      setRole(data.role === "STUDENT" ? "student" : "instructor");
      router.push("/courses");
    } catch (err) {
      if (err instanceof ApiError) {
        // 필드 에러가 있는 경우
        if (err.fieldErrors) {
          Object.entries(err.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof SignUpFormData, {
              type: "manual",
              message,
            });
          });
        }
        // 전역 에러 표시
        setApiError(err.message);
      } else {
        const errorMessage = err instanceof Error ? err.message : "회원가입에 실패했습니다.";
        setApiError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{apiError}</div>}

      <InputField
        label="이름"
        placeholder="홍길동"
        type="text"
        register={register("name")}
        error={errors.name?.message}
      />

      <InputField
        label="이메일"
        placeholder="you@example.com"
        type="email"
        register={register("email")}
        error={errors.email?.message}
      />

      <InputField
        label="휴대폰 번호"
        placeholder="010-1234-5678"
        type="tel"
        register={register("phone")}
        error={errors.phone?.message}
      />

      <InputField
        label="비밀번호"
        placeholder="••••••••"
        type="password"
        register={register("password")}
        error={errors.password?.message}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">회원 유형</legend>
        <div className="space-y-2">
          <RadioField
            label="수강생"
            value="STUDENT"
            register={register("role")}
            checked={role === "STUDENT"}
          />
          <RadioField
            label="강사"
            value="INSTRUCTOR"
            register={register("role")}
            checked={role === "INSTRUCTOR"}
          />
        </div>
        {errors.role?.message && <p className="text-xs text-red-500">{errors.role.message}</p>}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "가입 중..." : "회원가입"}
      </button>

      <button
        type="button"
        className="w-full rounded-md border px-4 py-2"
        onClick={() => router.push("/sign-in")}>
        로그인 하러 가기
      </button>
    </form>
  );
}
