import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
