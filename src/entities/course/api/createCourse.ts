import { apiFetch } from "@/shared/api";
import { CreateCourseRequest, CreateCourseResponse } from "../model/types";

export async function createCourse(
  data: CreateCourseRequest,
  accessToken: string
): Promise<CreateCourseResponse> {
  return apiFetch<CreateCourseResponse>("/api/courses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
}
