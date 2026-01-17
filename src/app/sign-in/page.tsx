"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/features/auth/ui/SignInForm";
import { useAuthStore } from "@/features/auth/model/useAuthStore";

export default function SignInPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // 이미 로그인한 사용자는 강의 목록으로 리다이렉트
    if (isAuthenticated) {
      router.replace("/courses");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">강의 목록으로 이동 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6">
      <h1 className="text-xl font-bold">Sign In</h1>
      <div className="mt-6">
        <SignInForm />
      </div>
    </main>
  );
}
