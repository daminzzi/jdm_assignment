import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/entities/course/api/fetchCourses";

export function useCoursesQuery(sort: string) {
  return useInfiniteQuery({
    queryKey: ["courses", { sort }],
    queryFn: ({ pageParam = 0 }) => fetchCourses(pageParam, sort, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    staleTime: 60_000,
  });
}
