import { NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // Public routes allowed without token
  if (
    req.nextUrl.pathname.startsWith("/api/public") ||
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  // If NO token, block protected pages
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token is invalid
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
