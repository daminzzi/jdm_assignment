"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "recent", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "rate", label: "신청률순" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "recent";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`/courses?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-2 text-sm transition ${
            current === opt.value ? "bg-black text-white" : "border bg-white hover:border-gray-400"
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
