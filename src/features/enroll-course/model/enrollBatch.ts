import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enrollBatch } from "@/entities/enrollment/api/enrollBatchAPI";
import { useAuthStore } from "@/features/auth/model/useAuthStore";
import { useCourseSelect } from "@/features/course-select/model/useCourseSelect";
import { useEnrollStore } from "./useEnrollStore";

export function useEnrollBatch() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { clear: clearSelection } = useCourseSelect();
  const { setEnrollResult } = useEnrollStore();

  return useMutation({
    mutationFn: async (courseIds: number[]) => {
      if (!accessToken) {
        throw new Error("인증이 필요합니다");
      }
      return enrollBatch(courseIds, accessToken);
    },
    onSuccess: (data) => {
      // 배치 API 응답 성공 시 항상 complete 페이지로 이동 (전체 성공/부분 성공/전체 실패 모두)
      // Zustand 상태 업데이트를 먼저 수행
      setEnrollResult(data);
      clearSelection(); // 사용자가 다시 선택할 수 있도록 항상 초기화
      
      // courses 캐시 무효화 (강의 정원 변경 반영) - 성공이 있을 때만
      if (data.success.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      }
      
      // 상태 업데이트가 완료된 후 라우팅 (다음 틱에서 실행)
      setTimeout(() => {
        router.push("/enroll/complete");
      }, 0);
    },
    onError: (error: any) => {
      // 401 에러 처리
      if (error?.response?.code === "A003") {
        alert("인증이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push("/sign-in");
      }
      // 그 외 에러는 호출 측에서 처리 (toast 등)
    },
  });
}
