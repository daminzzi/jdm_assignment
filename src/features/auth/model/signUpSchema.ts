import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  password: z
    .string()
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다")
    .max(10, "비밀번호는 최대 10자 이하여야 합니다")
    .regex(/[a-zA-Z]/, "비밀번호에 영문이 포함되어야 합니다")
    .regex(/[0-9]/, "비밀번호에 숫자가 포함되어야 합니다"),
  name: z.string().min(1, "이름을 입력해주세요").max(50, "이름은 50자 이하여야 합니다"),
  phone: z
    .string()
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다 (예: 010-1234-5678)"),
  role: z.enum(["STUDENT", "INSTRUCTOR"], {
    message: "역할을 선택해주세요",
  }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
