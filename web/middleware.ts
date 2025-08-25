import { NextResponse, type NextRequest } from "next/server";

// Protected routes that require authentication
const protectedPaths = ["/(dashboard)", "/(settings)", "/(administrator)", "/(root)/course/checkout"];

// Auth pages where logged-in users should not enter
const authPaths = ["/(auth)/login", "/(auth)/register", "/(auth)/verify", "/(auth)/reset-password", "/(auth)/forgot-password"];

function isPathMatch(pathname: string, bases: string[]): boolean {
  return bases.some((base) => pathname.startsWith(base));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read httpOnly token set by our app routes
  const accessToken = request.cookies.get("access_token")?.value;

  // If trying to access protected area without token, redirect to login
  if (isPathMatch(pathname, protectedPaths) && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/(auth)/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated, avoid showing auth pages
  if (accessToken && isPathMatch(pathname, authPaths)) {
    const url = request.nextUrl.clone();
    url.pathname = "/(dashboard)/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["dashboard/:path*", "settings/:path*", "/(administrator)/:path*"],
};
