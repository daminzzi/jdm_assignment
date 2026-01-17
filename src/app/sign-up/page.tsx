"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "@/features/auth/ui/SignUpForm";
import { useAuthStore } from "@/features/auth/model/useAuthStore";

export default function SignUpPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
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
      <section className="mx-auto max-w-md" aria-labelledby="signup-heading">
        <h1 id="signup-heading" className="text-xl font-bold">
          회원 가입
        </h1>
        <div className="mt-6">
          <SignUpForm />
        </div>
      </section>
    </main>
  );
}
