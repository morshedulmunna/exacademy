import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { UserRole } from "./types";

/**
 * Get the current user's session on the server side
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Check if the current user is an administrator
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole) {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]) {
  const user = await getCurrentUser();
  return user?.role ? roles.includes(user.role) : false;
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require admin role - throws error if user is not an admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Administrator access required");
  }
  return user;
}

/**
 * Require specific role - throws error if user doesn't have the role
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`${role} access required`);
  }
  return user;
} 