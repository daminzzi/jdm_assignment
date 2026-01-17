"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/model/useAuthStore";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // 로그인된 사용자는 강의 목록으로 자동 이동
    if (isAuthenticated) {
      router.replace("/courses");
    }
  }, [isAuthenticated, router]);

  // 로그인 상태 확인 중
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
    <main className="flex min-h-dvh items-center justify-center bg-linear-to-b from-orange-50 to-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md space-y-8 text-center">
        {/* 헤더 */}
        <header className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">월급쟁이 부자들</h1>
          <p className="text-lg text-orange-600 font-semibold">당신이 부자가 되는 곳</p>
          <p className="text-sm text-gray-600">직장인을 위한 재테크·부동산 교육 플랫폼</p>
        </header>

        {/* 설명 섹션 */}
        <section className="space-y-4 rounded-lg bg-white p-6 shadow-sm border border-orange-100">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">💰</span>
              <span className="text-3xl">📈</span>
              <span className="text-3xl">🏠</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">재테크·부동산으로 부자되기</h2>
            <p className="text-sm text-gray-600">
              직장인을 위한 재테크와 부동산 투자 교육으로 경제적 자유를 얻으세요. 국내 1위 교육
              커리큘럼으로 시작하세요.
            </p>
          </div>
        </section>

        {/* 액션 버튼 */}
        <nav className="space-y-3">
          <Link
            href="/sign-in"
            className="block w-full rounded-lg bg-orange-600 px-6 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-orange-700">
            로그인
          </Link>
          <Link
            href="/sign-up"
            className="block w-full rounded-lg border-2 border-orange-600 px-6 py-3 text-center text-base font-semibold text-orange-600 transition-colors hover:border-orange-700 hover:bg-orange-50">
            회원가입
          </Link>
        </nav>

        {/* 하단 텍스트 */}
        <p className="text-xs text-gray-500">지금 부자되는 커리큘럼 확인하고 강의를 탐색해보세요</p>
      </div>
    </main>
  );
}
