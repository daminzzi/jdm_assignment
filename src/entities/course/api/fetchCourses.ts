import { apiFetch } from "@/shared/api";
import { CoursesResponse } from "../model";

export async function fetchCourses(
  page: number,
  sort: string,
  size: number = 10
): Promise<CoursesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });

  return apiFetch<CoursesResponse>(`/api/courses?${params.toString()}`);
}
