"use client";

import { useIntersection } from "@/shared/lib/useIntersection";
import CourseCard from "@/entities/course/ui/CourseCard";
import { useCoursesQuery } from "./useCoursesQuery";

interface CourseListProps {
  sort: string;
}

export default function CourseList({ sort }: CourseListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, refetch } =
    useCoursesQuery(sort);

  const sentinelRef = useIntersection<HTMLLIElement>(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">강의 목록을 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50">
          재시도
        </button>
      </div>
    );
  }

  const allCourses = data?.pages.flatMap((page) => page.content) || [];

  return (
    <ul className="space-y-4 pb-20 sm:pb-32" role="list">
      {allCourses.map((course) => (
        <li key={course.id}>
          <CourseCard course={course} />
        </li>
      ))}

      <li ref={sentinelRef} className="h-32" aria-hidden="true" />

      {isFetchingNextPage && (
        <li className="py-4 text-center" role="status" aria-live="polite">
          <p className="text-sm text-gray-500">강의를 불러오는 중...</p>
        </li>
      )}

      {data && data.pages[data.pages.length - 1]?.last === false && !isFetchingNextPage && (
        <li className="rounded-lg border bg-white p-4 text-center" role="status">
          <p className="text-sm text-gray-500">추가 강의가 있습니다. 아래로 스크롤하세요.</p>
        </li>
      )}

      {data && data.pages[data.pages.length - 1]?.last === true && (
        <li className="rounded-lg border bg-white p-4 text-center" role="status">
          <p className="text-sm text-gray-500">더 이상 강의가 없습니다.</p>
        </li>
      )}
    </ul>
  );
}
