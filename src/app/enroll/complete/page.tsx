"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEnrollStore } from "@/features/enroll-course/model/useEnrollStore";

export default function EnrollCompletePage() {
  const router = useRouter();
  const { lastEnrollResult, clearEnrollResult } = useEnrollStore();

  useEffect(() => {
    // 결과 데이터가 없으면 courses로 리다이렉트
    if (!lastEnrollResult) {
      router.replace("/courses");
    }
  }, [lastEnrollResult, router]);

  if (!lastEnrollResult) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">강의 목록으로 이동 중...</p>
        </div>
      </main>
    );
  }

  const { success, failed } = lastEnrollResult;
  const hasSuccess = success.length > 0;
  const hasFailed = failed.length > 0;

  return (
    <main className="min-h-dvh bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              hasSuccess && !hasFailed
                ? "bg-green-100"
                : hasSuccess && hasFailed
                  ? "bg-yellow-100"
                  : "bg-red-100"
            }`}>
            <span className="text-3xl">
              {hasSuccess && !hasFailed ? "✓" : hasSuccess && hasFailed ? "⚠" : "✕"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {hasSuccess && !hasFailed
              ? "수강 신청 완료"
              : hasSuccess && hasFailed
                ? "수강 신청 부분 완료"
                : "수강 신청 실패"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {hasSuccess
              ? `${success.length}개의 강의 신청이 완료되었습니다.`
              : "모든 강의 신청에 실패했습니다."}
          </p>
        </div>

        {/* 성공 목록 */}
        {hasSuccess && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-green-700">
              신청 완료 ({success.length}개)
            </h2>
            <div className="space-y-3">
              {success.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.courseTitle}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        수강 신청 ID: {item.enrollmentId}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                      완료
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 실패 목록 */}
        {hasFailed && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-red-700">
              신청 실패 ({failed.length}개)
            </h2>
            <div className="space-y-3">
              {failed.map((item, index) => (
                <div
                  key={`${item.courseId}-${index}`}
                  className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">강의 ID: {item.courseId}</h3>
                      <p className="mt-1 text-sm text-red-700">{item.reason}</p>
                    </div>
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                      실패
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/courses"
            onClick={() => clearEnrollResult()}
            className="flex-1 rounded-lg border bg-white px-6 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50">
            강의 목록으로
          </Link>
          {hasFailed && (
            <Link
              href="/courses"
              onClick={() => clearEnrollResult()}
              className="flex-1 rounded-lg bg-black px-6 py-3 text-center text-base font-medium text-white hover:bg-gray-800">
              다시 선택하기
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
