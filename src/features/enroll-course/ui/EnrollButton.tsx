"use client";

import { useEnrollBatch } from "../model/enrollBatch";

interface EnrollButtonProps {
  courseIds: number[];
  onError?: (message: string) => void;
}

export default function EnrollButton({ courseIds, onError }: EnrollButtonProps) {
  const { mutate, isPending } = useEnrollBatch();

  const handleEnroll = () => {
    mutate(courseIds, {
      onError: (error: any) => {
        const message = error?.response?.message || error?.message || "수강 신청에 실패했습니다";
        onError?.(message);
      },
    });
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={isPending || courseIds.length === 0}
      className="w-full rounded-lg bg-black px-6 py-4 text-base font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500">
      {isPending ? "신청 중..." : `${courseIds.length}개 강의 수강 신청`}
    </button>
  );
}
