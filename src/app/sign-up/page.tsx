"use client";

import SignUpForm from "@/features/auth/ui/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="min-h-dvh p-6">
      <h1 className="text-xl font-bold">회원 가입</h1>
      <div className="mt-6">
        <SignUpForm />
      </div>
    </main>
  );
}
