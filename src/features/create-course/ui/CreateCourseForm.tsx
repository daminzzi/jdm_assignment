"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/features/auth/ui/InputField";
import { useCreateCourseMutation } from "../model/useCreateCourseMutation";
import { createCourseSchema, type CreateCourseFormData } from "../model/createCourseSchema";
import { extractCourseFieldFromMessage } from "../model/courseErrors";
import { ApiError } from "@/shared/lib";

export default function CreateCourseForm() {
  const mutation = useCreateCourseMutation();
  const [apiError, setApiError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      instructorName: "",
      maxStudents: 30,
      price: 0,
      description: "",
    },
  });

  const onSubmit = async (data: CreateCourseFormData) => {
    setApiError("");

    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      if (err instanceof ApiError) {
        // 필드 에러가 있는 경우
        if (err.fieldErrors) {
          Object.entries(err.fieldErrors).forEach(([field, message]) => {
            const fieldName = extractCourseFieldFromMessage(message, err.code);
            if (fieldName) {
              setError(fieldName as keyof CreateCourseFormData, {
                type: "manual",
                message: message as string,
              });
            }
          });
        }
        // 필드 에러가 없으면 전체 에러로 표시
        if (!err.fieldErrors || Object.keys(err.fieldErrors).length === 0) {
          setApiError(err.message);
        }
      } else {
        setApiError("요청 실패. 다시 시도해주세요");
      }
    }
  };

  const isLoading = isSubmitting || mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* API 에러 메시지 */}
      {apiError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{apiError}</div>}

      {/* 제목 필드 */}
      <div>
        <InputField<CreateCourseFormData>
          label="강의 제목"
          placeholder="예: React 기초 마스터"
          type="text"
          register={register("title")}
          error={errors.title?.message}
        />
      </div>

      {/* 강사 이름 필드 */}
      <div>
        <InputField<CreateCourseFormData>
          label="강사 이름"
          placeholder="예: 김강사"
          type="text"
          register={register("instructorName")}
          error={errors.instructorName?.message}
        />
      </div>

      {/* 최대 수강 인원 필드 */}
      <div>
        <InputField<CreateCourseFormData>
          label="최대 수강 인원"
          placeholder="1 이상"
          type="text"
          register={register("maxStudents", { valueAsNumber: true })}
          error={errors.maxStudents?.message}
        />
      </div>

      {/* 수강료 필드 */}
      <div>
        <InputField<CreateCourseFormData>
          label="수강료 (원)"
          placeholder="0 이상"
          type="text"
          register={register("price", { valueAsNumber: true })}
          error={errors.price?.message}
        />
      </div>

      {/* 강의 설명 필드 (선택) */}
      <div>
        <label className="block">
          <span className="text-sm font-medium">강의 설명 (선택)</span>
          <textarea
            {...register("description")}
            placeholder="강의에 대한 설명을 입력해주세요."
            className={`mt-1 w-full rounded-md border px-3 py-2 outline-none transition ${
              errors.description
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-gray-400"
            } h-24 resize-none`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </label>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-md py-2 font-medium text-white transition ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        }`}>
        {isLoading ? "등록 중..." : "강의 등록"}
      </button>
    </form>
  );
}
