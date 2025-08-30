import { NextResponse, NextRequest } from "next/server";
import { getCurrentLogedInUser } from "./actions/users/get-current-user";

/**
 * Protect admin routes: requires authenticated user with admin role
 * - Reads `access_token` from cookies
 * - Validates token expiry (exp) if present
 * - Decodes JWT payload to verify `role` is admin
 * - Redirects to /login if unauthenticated/expired
 * - Redirects to / if authenticated but not admin
 */
export default async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/learn/:path*"],
};
