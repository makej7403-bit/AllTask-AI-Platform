import { NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.next();

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/explorer/:path*"]
};
