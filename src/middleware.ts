import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // If trying to access admin routes (except login) without session
  if (request.nextUrl.pathname.startsWith("/admin") && !isLoginPage) {
    if (!adminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If trying to access login page WITH session, redirect to dashboard
  if (isLoginPage && adminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
