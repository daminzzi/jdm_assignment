import { Suspense } from "react";
import CoursesPageClient from "./CoursesPageClient";

export default function CoursesPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-gray-50" />}>
      <CoursesPageClient />
    </Suspense>
  );
}
