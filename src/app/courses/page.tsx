"use client";

import { useSearchParams } from "next/navigation";
import HeaderAuth from "@/features/course/ui/HeaderAuth";
import { SortSelect } from "@/features/course-filter/ui/SortSelect";
import CourseList from "@/widgets/course-list/CourseList";
import FooterEnrollBar from "@/widgets/footer-enroll-bar/FooterEnrollBar";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "recent";

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Course List</p>
            <h1 className="text-2xl font-bold text-gray-900">강의 탐색</h1>
          </div>
          <HeaderAuth />
        </div>
      </header>

      {/* 정렬 선택 */}
      <nav
        className="sticky top-20 z-20 border-b bg-white/95 backdrop-blur"
        aria-label="강의 정렬 옵션">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">정렬</span>
            <SortSelect />
          </div>
        </div>
      </nav>

      {/* 강의 목록 */}
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <CourseList sort={sort} />
      </section>

      <FooterEnrollBar />
    </main>
  );
}
