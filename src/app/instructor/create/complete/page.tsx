"use client";

import Link from "next/link";

export default function CreateCompletePagePage() {
  return (
    <main className="min-h-dvh bg-gray-50 py-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
        {/* 성공 아이콘 */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 성공 메시지 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">강의 등록 완료</h1>
        <p className="text-gray-600 mb-8">새로운 강의가 성공적으로 등록되었습니다.</p>

        {/* 버튼 */}
        <Link
          href="/instructor"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition">
          강의 관리로 돌아가기
        </Link>
      </div>
    </main>
  );
}
