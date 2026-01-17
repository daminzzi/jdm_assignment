"use client";

import { useCourseSelect } from "@/features/course-select/model/useCourseSelect";
import type { Course } from "../model/types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { selectedCourseIds, toggle } = useCourseSelect();
  const isSelected = selectedCourseIds.includes(course.id);

  return (
    <article
      onClick={() => toggle(course.id)}
      className="cursor-pointer rounded-lg border bg-white/80 p-4 shadow-sm transition hover:shadow-md backdrop-blur">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300"
          aria-label={`Select ${course.title}`}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{course.title}</h3>
          <p className="mt-1 text-sm text-gray-600">강사: {course.instructorName}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span>
                {course.currentStudents}/{course.maxStudents} 명
              </span>
              <span className="ml-2">(남은 자리: {course.availableSeats})</span>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {course.price.toLocaleString()}원
            </span>
          </div>
          {course.isFull && <p className="mt-2 text-sm font-semibold text-red-600">정원 마감</p>}
        </div>
      </div>
    </article>
  );
}
