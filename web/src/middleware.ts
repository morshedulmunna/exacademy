import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route bases that should be protected by auth
const protectedBases = ["/dashboard", "/profile", "/settings", "/admin-handler"];

// Auth pages (actual URLs are without route group names)
const authPages = ["/login", "/register", "/verify", "/reset-password", "/forgot-password"];

function isPathMatch(pathname: string, bases: string[]): boolean {
  return bases.some((base) => pathname.startsWith(base));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If accessing protected area without token, redirect to login
  if (isPathMatch(pathname, protectedBases) && !accessToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and visiting auth pages, send to dashboard
  if (accessToken && isPathMatch(pathname, authPages)) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/admin-handler/:path*", "/login", "/register", "/verify", "/reset-password", "/forgot-password"],
};
