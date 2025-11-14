import { NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  // Public endpoints
  const publicPrefixes = ['/', '/api/health', '/api/modules/list', '/api/auth', '/api/openai'];
  if (publicPrefixes.some(p => url === p || url.startsWith(p))) {
    return NextResponse.next();
  }

  // Admin protection
  if (url.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    const user = verifyToken(token);
    if (!user || user.role !== "admin") return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  }

  // For other protected pages — if token missing redirect to login
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  const user = verifyToken(token);
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*"]
};
