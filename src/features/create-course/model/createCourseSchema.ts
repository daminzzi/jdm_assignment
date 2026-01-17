import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1, "강의 제목을 입력해주세요").max(200, "제목은 200자 이하여야 합니다"),
  instructorName: z.string().min(1, "강사 이름을 입력해주세요").max(50, "강사 이름은 50자 이하여야 합니다"),
  maxStudents: z
    .number({ message: "최대 수강 인원은 숫자여야 합니다" })
    .min(1, "최대 수강 인원은 1명 이상이어야 합니다")
    .max(10000, "최대 수강 인원은 10000명 이하여야 합니다"),
  price: z
    .number({ message: "수강료는 숫자여야 합니다" })
    .min(0, "수강료는 0원 이상이어야 합니다")
    .max(9999999, "수강료는 9,999,999원 이하여야 합니다"),
  description: z.string().max(1000, "설명은 1000자 이하여야 합니다").optional(),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
