/**
 * Fetch a user's profile by ID from the API.
 * Returns the Users API "data" object (not the full envelope).
 */
import { apiFetch } from "../http";

export interface ApiEnvelope<T> {
  message: string;
  timestamp: string;
  status_code: number;
  data: T;
}

export type ApiUserRole = "user" | "admin";

export interface ApiUser {
  id: string;
  username: string | null;
  email: string;
  role: ApiUserRole;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_blocked: boolean;
  created_at: string; // ISO datetime
}

export async function getUserById(userId: string): Promise<ApiUser> {
  if (!userId) throw new Error("userId is required");
  const res = await apiFetch<ApiEnvelope<ApiUser>>(`/api/users/${userId}`);
  return res.data;
}
