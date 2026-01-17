"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCourseSelect } from "@/features/course-select/model/useCourseSelect";
import { EnrollSummary } from "@/widgets/enroll-summary";

export default function EnrollPage() {
  const router = useRouter();
  const { selectedCourseIds } = useCourseSelect();

  useEffect(() => {
    // 선택된 강의가 없으면 courses 페이지로 리다이렉트
    if (selectedCourseIds.length === 0) {
      router.replace("/courses");
    }
  }, [selectedCourseIds.length, router]);

  // 선택이 비어있으면 로딩 상태 표시 (리다이렉트 전까지)
  if (selectedCourseIds.length === 0) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">강의 목록으로 이동 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* 헤더 */}
        <header className="mb-6">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            aria-label="강의 목록으로 돌아가기">
            ← 강의 목록으로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">수강 신청 확인</h1>
          <p className="mt-2 text-sm text-gray-600">
            선택한 강의를 확인하고 수강 신청을 완료하세요.
          </p>
        </header>

        {/* 메인 콘텐츠 */}
        <section>
          <EnrollSummary />
        </section>
      </div>
    </main>
  );
}
