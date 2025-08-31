import { NextResponse, NextRequest } from "next/server";

/**
 * Middleware: Protect only `/admin/:path*` routes for ADMIN users
 * - Requires `access_token` cookie (JWT)
 * - Validates token expiry (exp)
 * - Checks `role` claim equals `ADMIN`
 * - Redirects unauthenticated/expired to `/login`
 * - Redirects authenticated non-admin to `/`
 */
export default async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  // No token: force login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decode JWT payload (base64url) without external deps
  const decodeJwtPayload = (token: string): any | null => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const payload = decodeJwtPayload(accessToken);

  // Invalid token: force login
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Expired token: force login
  const exp = typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  if (exp && Date.now() >= exp) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role check: allow only ADMIN
  const role: string | undefined = payload.role || payload.user?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
