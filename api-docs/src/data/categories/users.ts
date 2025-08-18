import { ApiCategory } from "@/types/api";

/**
 * Users category and endpoints
 */
export const usersCategory: ApiCategory = {
  id: "users",
  name: "Users",
  description: "User management and profile endpoints",
  endpoints: [
    {
      id: "get-profile",
      method: "GET",
      path: "/users/profile",
      title: "Get User Profile",
      description: "Retrieve the current user's profile information",
      category: "users",
      tags: ["users", "profile"],
      authentication: "bearer",
      responses: [
        {
          statusCode: 200,
          description: "Profile retrieved successfully",
          contentType: "application/json",
          example: {
            success: true,
            data: {
              id: "123",
              name: "John Doe",
              email: "john@example.com",
              avatar: "https://example.com/avatar.jpg",
              enrolledCourses: ["1", "2", "3"],
            },
          },
        },
      ],
    },
  ],
};
