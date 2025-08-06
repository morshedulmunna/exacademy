import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    const adminRoutes = [
      "/admin-handler",
      "/api/posts",
      "/api/tags",
    ];

    // Check if the current path requires admin access
    const isAdminRoute = adminRoutes.some(route => 
      path.startsWith(route) && req.method !== "GET"
    );

    if (isAdminRoute && token?.role !== "ADMIN") {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to GET requests on /api/posts
        if (req.nextUrl.pathname === "/api/posts" && req.method === "GET") {
          return true;
        }

        // Allow public access to GET requests on /api/users/profile
        if (req.nextUrl.pathname === "/api/users/profile" && req.method === "GET") {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/profile", 
    "/dashboard", 
    "/admin-handler",
    "/api/posts", 
    "/api/users/profile",
    "/api/tags"
  ],
};
