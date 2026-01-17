"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

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

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === current)?.label || "최신순";

  return (
    <Select.Root value={current} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500">
        <Select.Value>{currentLabel}</Select.Value>
        <Select.Icon className="ml-2 text-gray-600">
          <ChevronDownIcon width={16} height={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          position="popper"
          sideOffset={4}>
          <Select.ScrollUpButton className="flex items-center justify-center h-6 text-gray-600" />
          <Select.Viewport className="p-1">
            {SORT_OPTIONS.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="relative flex cursor-pointer items-center rounded px-8 py-2 text-sm text-gray-900 hover:bg-orange-50 focus:bg-orange-100 focus:outline-none data-highlighted:bg-orange-100 data-highlighted:text-gray-900">
                <Select.ItemIndicator className="absolute left-2">
                  <CheckIcon width={16} height={16} className="text-orange-600" />
                </Select.ItemIndicator>
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 text-gray-600" />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
