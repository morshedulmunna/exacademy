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
  // Handle explicit logout: clear cookies and client storage, then redirect
  if (request.nextUrl.pathname === "/logout") {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    response.headers.set("Clear-Site-Data", '"cookies", "storage"');
    return response;
  }

  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:9098";

  const accessToken = request.cookies.get("access_token")?.value;

  // Helper: decode JWT payload (base64url) without external deps
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

  // Helper: try to refresh tokens using refresh_token cookie
  const tryRefreshTokens = async (): Promise<{ accessToken?: string; refreshToken?: string } | null> => {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return null;
      const json: any = await res.json().catch(() => ({}));
      const data = json?.data ?? json ?? {};
      const newAccessToken: string | undefined = data?.access_token;
      const newRefreshToken: string | undefined = data?.refresh_token;
      if (!newAccessToken) return null;
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      return null;
    }
  };

  // Get initial payload if we have a token
  let tokenToUse = accessToken;
  let payload = tokenToUse ? decodeJwtPayload(tokenToUse) : null;

  // If no token or invalid token, attempt refresh
  if (!payload) {
    const refreshed = await tryRefreshTokens();
    if (!refreshed?.accessToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set("Clear-Site-Data", '"cookies", "storage"');
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
    tokenToUse = refreshed.accessToken;
    payload = decodeJwtPayload(refreshed.accessToken);
    // If still invalid after refresh, treat as failure
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set("Clear-Site-Data", '"cookies", "storage"');
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
    // Persist refreshed tokens
    const isSecure = request.nextUrl.protocol === "https:";
    const resp = NextResponse.next();
    resp.cookies.set("access_token", tokenToUse!, { path: "/", sameSite: "lax", secure: isSecure });
    if (refreshed.refreshToken) {
      resp.cookies.set("refresh_token", refreshed.refreshToken, { path: "/", sameSite: "lax", secure: isSecure });
    }
    // After setting cookies, continue with role/expiry checks below using tokenToUse/payload
    // Return resp at the very end if all checks pass
    // Store to reuse later
    (request as any)._prebuiltResponse = resp;
  }

  // If expired, attempt refresh once
  const exp = typeof payload?.exp === "number" ? payload!.exp * 1000 : 0;
  if (exp && Date.now() >= exp) {
    const refreshed = await tryRefreshTokens();
    if (!refreshed?.accessToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set("Clear-Site-Data", '"cookies", "storage"');
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
    tokenToUse = refreshed.accessToken;
    payload = decodeJwtPayload(refreshed.accessToken);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set("Clear-Site-Data", '"cookies", "storage"');
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
    const isSecure = request.nextUrl.protocol === "https:";
    const resp = (request as any)._prebuiltResponse || NextResponse.next();
    resp.cookies.set("access_token", tokenToUse!, { path: "/", sameSite: "lax", secure: isSecure });
    if (refreshed.refreshToken) {
      resp.cookies.set("refresh_token", refreshed.refreshToken, { path: "/", sameSite: "lax", secure: isSecure });
    }
    (request as any)._prebuiltResponse = resp;
  }

  // Role check: allow only ADMIN
  const role: string | undefined = (payload as any)?.role || (payload as any)?.user?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If we already built a response (after refresh), reuse it; otherwise proceed
  const maybeResp = (request as any)._prebuiltResponse as NextResponse | undefined;
  return maybeResp || NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
