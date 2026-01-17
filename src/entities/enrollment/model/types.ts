export interface EnrollRequest {
  courseIds: number[];
}

export interface EnrollSuccessItem {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
}

export interface EnrollFailedItem {
  courseId: number;
  reason: string;
}

export interface BatchEnrollResponse {
  success: EnrollSuccessItem[];
  failed: EnrollFailedItem[];
}

export interface EnrollResult {
  success: EnrollSuccessItem[];
  failed: EnrollFailedItem[];
}
