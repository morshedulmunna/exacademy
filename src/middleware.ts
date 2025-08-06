import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
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
  matcher: ["/profile", "/dashboard", "/api/posts", "/api/users/profile"],
};
