"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InstructorFAB() {
  const [isInstructor, setIsInstructor] = useState(false);

  useEffect(() => {
    // 쿠키에서 role 확인
    const roleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    setIsInstructor(roleCookie === "INSTRUCTOR");
  }, []);

  if (!isInstructor) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-24 z-30">
      {/* 메인 버튼 */}
      <Link
        href="/instructor"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        title="강사 메뉴">
        <span className="text-2xl">👨‍🏫</span>
      </Link>
    </div>
  );
}
