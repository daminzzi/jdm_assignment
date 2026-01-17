"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createCourse } from "@/entities/course/api/createCourse";
import { useAuthStore } from "@/features/auth/model/useAuthStore";
import { CreateCourseFormData } from "./createCourseSchema";

export function useCreateCourseMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (data: CreateCourseFormData) => {
      if (!accessToken) {
        throw new Error("인증이 필요합니다");
      }

      return createCourse(
        {
          title: data.title,
          instructorName: data.instructorName,
          maxStudents: data.maxStudents,
          price: data.price,
          description: data.description,
        },
        accessToken
      );
    },
    onSuccess: () => {
      // 강의 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      // 완료 페이지로 이동
      router.push("/instructor/create/complete");
    },
    onError: (error: any) => {
      // 401 에러 처리
      if (error?.response?.code === "A003") {
        alert("인증이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push("/sign-in");
      }
      // 403 에러 처리
      else if (error?.response?.code === "C003") {
        alert("강사만 강의를 등록할 수 있습니다.");
        router.push("/courses");
      }
      // 그 외 에러는 호출 측에서 처리
    },
  });
}
