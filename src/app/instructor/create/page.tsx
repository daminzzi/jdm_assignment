import Link from "next/link";
import CreateCourseForm from "@/features/create-course/ui/CreateCourseForm";

export default function CreateCoursePage() {
  return (
    <main className="min-h-dvh bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* 헤더 */}
        <header className="mb-8">
          <Link
            href="/instructor"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            aria-label="강의 관리로 돌아가기">
            ← 강의 관리로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">강의 개설</h1>
          <p className="mt-2 text-gray-600">새로운 강의를 개설하세요.</p>
        </header>

        {/* 강의 개설 폼 */}
        <section className="bg-white rounded-lg shadow p-4">
          <CreateCourseForm />
        </section>
      </div>
    </main>
  );
}
