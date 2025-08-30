import { NextResponse, NextRequest } from "next/server";

/**
 * Protect admin routes: requires authenticated user with admin role
 * - Reads `access_token` from cookies
 * - Validates token expiry (exp) if present
 * - Decodes JWT payload to verify `role` is admin
 * - Redirects to /login if unauthenticated/expired
 * - Redirects to / if authenticated but not admin
 */
export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only guard admin routes (matcher also restricts, but keep guard cheap)
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthOnlyRoute = pathname.startsWith("/user") || pathname.startsWith("/learn");
  if (!isAdminRoute && !isAuthOnlyRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  // Helper: decode base64url safely
  const decodeBase64Url = (input: string) => {
    try {
      const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  // Redirect unauthenticated users to login with redirect back
  const redirectToLogin = () => {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  };

  if (!accessToken) {
    return redirectToLogin();
  }

  // Validate JWT and role (best-effort; no signature verification here)
  const parts = accessToken.split(".");
  if (parts.length !== 3) {
    return redirectToLogin();
  }

  const payload = decodeBase64Url(parts[1]);
  if (!payload || typeof payload !== "object") {
    return redirectToLogin();
  }

  // Check expiry if present
  const exp = typeof (payload as any).exp === "number" ? (payload as any).exp : undefined;
  if (exp && Date.now() / 1000 >= exp) {
    return redirectToLogin();
  }

  if (isAdminRoute) {
    // Determine admin role
    const roleValue = ((payload as any).role || (Array.isArray((payload as any).roles) ? (payload as any).roles : undefined)) as string | string[] | undefined;
    const isAdmin = Array.isArray(roleValue) ? roleValue.some((r) => String(r).toLowerCase() === "admin") : String(roleValue || "").toLowerCase() === "admin";

    if (!isAdmin) {
      // Authenticated but not admin: send home
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/learn/:path*"],
};
