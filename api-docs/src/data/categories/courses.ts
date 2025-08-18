import { ApiCategory } from "@/types/api";

/**
 * Courses category and endpoints
 */
export const coursesCategory: ApiCategory = {
  id: "courses",
  name: "Courses",
  description: "Course management and content endpoints",
  endpoints: [
    {
      id: "get-courses",
      method: "GET",
      path: "/courses",
      title: "Get All Courses",
      description: "Retrieve a list of all available courses",
      category: "courses",
      tags: ["courses", "listing"],
      parameters: [
        {
          name: "page",
          type: "number",
          required: false,
          description: "Page number for pagination",
          defaultValue: 1,
          location: "query",
        },
        {
          name: "limit",
          type: "number",
          required: false,
          description: "Number of courses per page",
          defaultValue: 10,
          location: "query",
        },
        {
          name: "category",
          type: "string",
          required: false,
          description: "Filter by course category",
          location: "query",
        },
      ],
      responses: [
        {
          statusCode: 200,
          description: "Courses retrieved successfully",
          contentType: "application/json",
          example: {
            success: true,
            data: {
              courses: [
                {
                  id: "1",
                  title: "Introduction to Programming",
                  description: "Learn the basics of programming",
                  instructor: "John Smith",
                  price: 99.99,
                  rating: 4.5,
                },
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 50,
                totalPages: 5,
              },
            },
          },
        },
      ],
    },
    {
      id: "get-course",
      method: "GET",
      path: "/courses/{id}",
      title: "Get Course Details",
      description: "Retrieve detailed information about a specific course",
      category: "courses",
      tags: ["courses", "details"],
      parameters: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Course ID",
          location: "path",
        },
      ],
      responses: [
        {
          statusCode: 200,
          description: "Course details retrieved successfully",
          contentType: "application/json",
          example: {
            success: true,
            data: {
              id: "1",
              title: "Introduction to Programming",
              description: "Learn the basics of programming",
              instructor: "John Smith",
              price: 99.99,
              rating: 4.5,
              modules: [
                {
                  id: "1",
                  title: "Getting Started",
                  lessons: [
                    {
                      id: "1",
                      title: "What is Programming?",
                      duration: "15 minutes",
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          statusCode: 404,
          description: "Course not found",
          contentType: "application/json",
          example: {
            success: false,
            error: "Course not found",
          },
        },
      ],
    },
  ],
};
