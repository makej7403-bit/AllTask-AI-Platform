import { NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  if (url.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url });

    const user = verifyToken(token);
    if (!user || user.role !== "admin")
      return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
