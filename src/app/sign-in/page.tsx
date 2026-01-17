"use client";

import SignInForm from "@/features/auth/ui/SignInForm";

export default function SignInPage() {
  return (
    <main className="min-h-dvh p-6">
      <h1 className="text-xl font-bold">Sign In</h1>
      <div className="mt-6">
        <SignInForm />
      </div>
    </main>
  );
}
