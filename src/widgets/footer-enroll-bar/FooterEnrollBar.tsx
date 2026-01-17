"use client";

import Link from "next/link";
import { useCourseSelect } from "@/features/course-select/model/useCourseSelect";

export default function FooterEnrollBar() {
  const { selectedCourseIds, clear } = useCourseSelect();

  if (selectedCourseIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-sm font-medium text-gray-900">
          선택된 강의 <span className="font-bold text-blue-600">{selectedCourseIds.length}</span>개
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={clear}
            className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            전체 해제
          </button>
          <Link
            href="/enroll"
            scroll={false}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            수강 신청
          </Link>
        </div>
      </div>
    </div>
  );
}
