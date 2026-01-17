import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /instructor/* 경로 보호
  if (pathname.startsWith("/instructor")) {
    const role = request.cookies.get("role")?.value;

    // role 쿠키가 없거나 INSTRUCTOR가 아니면 리다이렉트
    if (!role || role !== "INSTRUCTOR") {
      // role이 없으면 /sign-in으로, 있지만 INSTRUCTOR가 아니면 /courses로
      const redirectUrl = !role ? "/sign-in" : "/courses";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/instructor/:path*"],
};
