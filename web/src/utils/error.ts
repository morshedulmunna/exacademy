/**
 * Normalize various error shapes to a user-facing string.
 * - Prefers our API error contract: { code, message, details }
 * - Falls back to Error.message, string, or a default provided message
 */
export function getErrorMessage(error: unknown, fallback: string = "Something went wrong"): string {
  if (!error) return fallback;

  // API error shape from actions/http.ts
  if (typeof error === "object" && error !== null) {
    const maybeApi = error as { message?: unknown } & Record<string, unknown>;
    const msg = maybeApi.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }

  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;

  try {
    return JSON.stringify(error);
  } catch {
    return fallback;
  }
}

/**
 * Extract a detailed message from API error details when available.
 * If details contain field errors, returns a concise concatenation.
 */
export function getDetailedApiMessage(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;

  // Example: { fieldErrors: [{ field, message }, ...] }
  const d = details as any;
  if (Array.isArray(d?.fieldErrors)) {
    const items = d.fieldErrors.map((it: any) => (typeof it?.message === "string" ? it.message : null)).filter(Boolean);
    if (items.length) return items.join(", ");
  }

  return null;
}
