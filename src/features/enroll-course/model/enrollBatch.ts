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
      // 부분 성공 판정: success가 1개 이상이면 complete로 이동
      if (data.success.length > 0) {
        // Zustand 상태 업데이트를 먼저 수행
        setEnrollResult(data);
        clearSelection();
        // courses 캐시 무효화 (강의 정원 변경 반영)
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        
        // 상태 업데이트가 완료된 후 라우팅 (다음 틱에서 실행)
        setTimeout(() => {
          router.push("/enroll/complete");
        }, 0);
      } else {
        // 모두 실패 - /enroll에 머물며 에러 처리는 onError에서
        throw new Error("모든 강의 신청에 실패했습니다");
      }
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
