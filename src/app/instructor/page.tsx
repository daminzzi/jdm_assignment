import Link from "next/link";

export default function InstructorPage() {
  return (
    <main className="min-h-dvh bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* 헤더 */}
        <header className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            aria-label="강의 목록으로 돌아가기">
            ← 강의 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">강의 관리</h1>
          <p className="mt-2 text-gray-600">강의를 개설하고 관리할 수 있습니다.</p>
        </header>

        {/* 메뉴 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="강의 관리 메뉴">
          {/* 강의 개설 */}
          <article className="group p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <Link href="/instructor/create" className="block">
              <span className="text-4xl mb-3 block">📝</span>
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                강의 개설
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                새로운 강의를 개설하고 강의 정보를 입력하세요.
              </p>
            </Link>
          </article>

          {/* 강의 목록 (향후) */}
          <article
            className="p-6 bg-white rounded-lg shadow opacity-50 cursor-not-allowed"
            aria-disabled="true">
            <span className="text-4xl mb-3 block">📊</span>
            <h2 className="text-xl font-semibold text-gray-400">내 강의</h2>
            <p className="mt-2 text-sm text-gray-400">
              개설한 강의 목록 및 통계를 확인할 수 있습니다. (준비중)
            </p>
          </article>

          {/* 강의 수정 (향후) */}
          <article
            className="p-6 bg-white rounded-lg shadow opacity-50 cursor-not-allowed"
            aria-disabled="true">
            <span className="text-4xl mb-3 block">✏️</span>
            <h2 className="text-xl font-semibold text-gray-400">강의 수정</h2>
            <p className="mt-2 text-sm text-gray-400">
              기존 강의의 정보를 수정할 수 있습니다. (준비중)
            </p>
          </article>

          {/* 학생 관리 (향후) */}
          <article
            className="p-6 bg-white rounded-lg shadow opacity-50 cursor-not-allowed"
            aria-disabled="true">
            <span className="text-4xl mb-3 block">👥</span>
            <h2 className="text-xl font-semibold text-gray-400">수강생 관리</h2>
            <p className="mt-2 text-sm text-gray-400">
              강의에 등록한 수강생을 관리할 수 있습니다. (준비중)
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
