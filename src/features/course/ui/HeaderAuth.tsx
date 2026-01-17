"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/model/useAuthStore";

export default function HeaderAuth() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Link
        href="/sign-in"
        className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
        로그인
      </Link>
    );
  }
  return (
    <div className="text-sm">
      <span className="font-medium text-gray-900">{user?.name}</span>
      <span className="ml-1 text-gray-600">님</span>
    </div>
  );
}
