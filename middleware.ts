import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  // /instructor/* 경로 보호 - role이 없거나 INSTRUCTOR가 아니면 리다이렉트
  if (pathname.startsWith("/instructor")) {
    if (!role || role !== "INSTRUCTOR") {
      const redirectUrl = !role ? "/sign-in" : "/courses";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // /enroll 경로 보호 - 로그인이 필요함
  if (pathname.startsWith("/enroll")) {
    if (!role) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/instructor/:path*", "/enroll/:path*"],
};
