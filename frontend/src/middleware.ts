import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/chat");

  // If user has token and is on an auth page, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user has no token and is on a protected page, redirect to login
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Also handle the root path redirect if authenticated
  if (token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/chat", "/login", "/signup"],
};
