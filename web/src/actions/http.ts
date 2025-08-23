/**
 * Minimal HTTP client for the ExAcademy API.
 * - Attaches Authorization header when access token exists
 * - Parses JSON and normalizes API errors
 */
import { getApiUrl, INTERNAL_API_BASE_URL } from "./config";

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

// Standard API envelope returned by backend
export type ApiEnvelope<T> = {
  message: string;
  timestamp: string;
  status_code: number;
  data: T;
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("exacademy.access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("exacademy.refresh_token");
}

function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("exacademy.access_token", token);
  // Mirror into cookie for SSR to pick up Authorization header automatically
  // Use a short default max-age; will be refreshed by tryRefreshToken when needed
  try {
    document.cookie = `exacademy.access_token=${encodeURIComponent(token)}; Path=/; Max-Age=900; SameSite=Lax`;
  } catch {}
}

function clearAuthStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("exacademy.access_token");
  window.localStorage.removeItem("exacademy.refresh_token");
  window.localStorage.removeItem("exacademy.user");
  try {
    // Expire cookies immediately
    document.cookie = "exacademy.access_token=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie = "exacademy.refresh_token=; Path=/; Max-Age=0; SameSite=Lax";
  } catch {}
}

async function tryRefreshToken(): Promise<boolean> {
  // Only run in the browser where localStorage is available
  if (typeof window === "undefined") return false;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(getApiUrl("/api/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) return false;

  // Expect ApiEnvelope
  const data = (payload as ApiEnvelope<{ access_token: string; refresh_token: string; token_type: string; expires_in: number }>).data;
  if (!data?.access_token) return false;
  setAccessToken(data.access_token);
  try {
    // Keep cookie in sync for SSR
    document.cookie = `exacademy.access_token=${encodeURIComponent(data.access_token)}; Path=/; Max-Age=${Math.max(60, Number(data.expires_in || 900))}; SameSite=Lax`;
  } catch {}
  // Backend echoes the same refresh_token per docs; keep existing
  return true;
}

export async function ServerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const attempt = async (): Promise<{ ok: boolean; status: number; payload: any; isJson: boolean }> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    };

    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // If in browser, use Next.js rewrite via same-origin
    if (typeof window !== "undefined") {
      const res = await fetch(getApiUrl(path), { ...init, headers });
      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const payload = isJson ? await res.json() : await res.text();
      return { ok: res.ok, status: res.status, payload, isJson };
    }

    // SSR: attach Authorization from cookie if present, then try multiple base URLs
    try {
      const { cookies } = await import("next/headers");
      const store = await cookies();
      const cookieToken = store.get("exacademy.access_token")?.value;
      if (cookieToken && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${cookieToken}`;
      }
    } catch {}

    // SSR: try multiple base URLs to avoid hard failures when one host is unreachable
    const normalize = (p: string) => (p.startsWith("/") ? p : `/${p}`);
    const normalizedPath = normalize(path);
    const candidates = [INTERNAL_API_BASE_URL, process.env.API_BASE_URL, "http://127.0.0.1:9098", "http://127.0.0.1:8080", "http://localhost:9098", "http://localhost:8080"].filter(Boolean) as string[];

    let lastError: unknown = null;
    for (const base of candidates) {
      const url = `${base}${normalizedPath}`;
      try {
        const res = await fetch(url, { ...init, headers });
        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const payload = isJson ? await res.json() : await res.text();
        return { ok: res.ok, status: res.status, payload, isJson };
      } catch (e) {
        lastError = e;
        continue;
      }
    }
    throw lastError ?? new Error("All server fetch attempts failed");
  };

  // First attempt
  let { ok, status, payload, isJson } = await attempt();
  if (!ok && status === 401) {
    // Try to refresh token and retry once
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      ({ ok, status, payload, isJson } = await attempt());
    } else {
      clearAuthStorage();
    }
  }

  if (!ok) {
    const error: ApiError = isJson && payload && typeof payload === "object" ? { code: payload.code ?? "INTERNAL_ERROR", message: payload.message ?? "Request failed", details: payload.details } : { code: "INTERNAL_ERROR", message: String(payload || "Request failed") };
    throw error;
  }

  return payload as T;
}

// ServerFetch: alias to apiFetch so callers can use a semantic name in server contexts
export default ServerFetch;
