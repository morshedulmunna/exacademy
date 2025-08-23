/**
 * Minimal HTTP client for the ExAcademy API.
 * - Attaches Authorization header when access token exists
 * - Parses JSON and normalizes API errors
 */
import { getApiUrl } from "./config";

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
}

function clearAuthStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("exacademy.access_token");
  window.localStorage.removeItem("exacademy.refresh_token");
  window.localStorage.removeItem("exacademy.user");
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

    const res = await fetch(getApiUrl(path), { ...init, headers });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();
    return { ok: res.ok, status: res.status, payload, isJson };
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

export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(getApiUrl(path), { method: "POST", body: form, headers });
  const payload = await res.json();
  if (!res.ok) {
    const error: ApiError = { code: payload?.code ?? "INTERNAL_ERROR", message: payload?.message ?? "Upload failed", details: payload?.details };
    throw error;
  }
  return payload as T;
}

// ServerFetch: alias to apiFetch so callers can use a semantic name in server contexts
export default ServerFetch;
