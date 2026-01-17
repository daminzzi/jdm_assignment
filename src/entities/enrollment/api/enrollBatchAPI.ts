import { apiFetch } from "@/shared/api";
import { EnrollRequest, BatchEnrollResponse } from "../model/types";

export async function enrollBatch(
  courseIds: number[],
  accessToken: string
): Promise<BatchEnrollResponse> {
  const body: EnrollRequest = { courseIds };

  return apiFetch<BatchEnrollResponse>("/api/enrollments/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
}
