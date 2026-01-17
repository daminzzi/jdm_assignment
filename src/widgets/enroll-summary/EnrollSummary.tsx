"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCourseSelect } from "@/features/course-select/model/useCourseSelect";
import EnrollButton from "@/features/enroll-course/ui/EnrollButton";
import { Course } from "@/entities/course/model/types";

export default function EnrollSummary() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { selectedCourseIds } = useCourseSelect();
  const queryClient = useQueryClient();

  // TanStack Query 캐시에서 강의 정보 매핑
  const selectedCourses = selectedCourseIds
    .map((id) => {
      // courses 쿼리 캐시에서 모든 페이지 데이터를 가져와 평면화
      const coursesData = queryClient.getQueriesData<{
        pages: Array<{ content: Course[] }>;
      }>({ queryKey: ["courses"] });

      for (const [, data] of coursesData) {
        if (data?.pages) {
          for (const page of data.pages) {
            const course = page.content.find((c) => c.id === id);
            if (course) return course;
          }
        }
      }
      return null;
    })
    .filter((course): course is Course => course !== null);

  const totalPrice = selectedCourses.reduce((sum, course) => sum + course.price, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="mt-2 text-sm text-red-600 underline">
            닫기
          </button>
        </div>
      )}

      {/* 선택 강의 목록 */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">
          선택한 강의 ({selectedCourses.length}개)
        </h2>
        {selectedCourses.map((course) => (
          <div key={course.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">{course.title}</h3>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>{course.instructorName}</span>
              <span className="font-medium text-gray-900">{course.price.toLocaleString()}원</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              잔여석: {course.availableSeats}/{course.maxStudents}
            </div>
          </div>
        ))}
      </div>

      {/* 총 금액 */}
      <div className="rounded-lg border-2 border-gray-900 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">총 수강료</span>
          <span className="text-xl font-bold text-gray-900">{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      {/* 신청 버튼 */}
      <EnrollButton courseIds={selectedCourseIds} onError={setErrorMessage} />
    </div>
  );
}
