"use client";

import Link from "next/link";

export default function InstructorPage() {
  return (
    <main className="min-h-dvh bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← 강의 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">강의 관리</h1>
          <p className="mt-2 text-gray-600">강의를 개설하고 관리할 수 있습니다.</p>
        </div>

        {/* 메뉴 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 강의 개설 */}
          <Link
            href="/instructor/create"
            className="group block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
              강의 개설
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              새로운 강의를 개설하고 강의 정보를 입력하세요.
            </p>
          </Link>

          {/* 강의 목록 (향후) */}
          <div className="p-6 bg-white rounded-lg shadow opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-3">📊</div>
            <h2 className="text-xl font-semibold text-gray-400">내 강의</h2>
            <p className="mt-2 text-sm text-gray-400">
              개설한 강의 목록 및 통계를 확인할 수 있습니다. (준비중)
            </p>
          </div>

          {/* 강의 수정 (향후) */}
          <div className="p-6 bg-white rounded-lg shadow opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-3">✏️</div>
            <h2 className="text-xl font-semibold text-gray-400">강의 수정</h2>
            <p className="mt-2 text-sm text-gray-400">
              기존 강의의 정보를 수정할 수 있습니다. (준비중)
            </p>
          </div>

          {/* 학생 관리 (향후) */}
          <div className="p-6 bg-white rounded-lg shadow opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-3">👥</div>
            <h2 className="text-xl font-semibold text-gray-400">수강생 관리</h2>
            <p className="mt-2 text-sm text-gray-400">
              강의에 등록한 수강생을 관리할 수 있습니다. (준비중)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
