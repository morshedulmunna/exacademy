import { ApiCategory } from "@/types/api";

/**
 * Authentication category and endpoints
 */
export const authCategory: ApiCategory = {
  id: "auth",
  name: "Authentication",
  description: "User authentication and authorization endpoints",
  endpoints: [
    {
      id: "login",
      method: "POST",
      path: "/auth/login",
      title: "User Login",
      description: "Authenticate a user with email and password",
      category: "auth",
      tags: ["authentication", "login"],
      requestBody: {
        required: true,
        description: "Login credentials",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          required: ["email", "password"],
        },
        example: {
          email: "user@example.com",
          password: "password123",
        },
      },
      responses: [
        {
          statusCode: 200,
          description: "Login successful",
          contentType: "application/json",
          example: {
            success: true,
            data: {
              user: {
                id: "123",
                email: "user@example.com",
                name: "John Doe",
              },
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        {
          statusCode: 401,
          description: "Invalid credentials",
          contentType: "application/json",
          example: {
            success: false,
            error: "Invalid email or password",
          },
        },
      ],
      examples: [
        {
          title: "Successful Login",
          description: "Example of a successful login request",
          request: {
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              email: "user@example.com",
              password: "password123",
            },
          },
          response: {
            statusCode: 200,
            body: {
              success: true,
              data: {
                user: {
                  id: "123",
                  email: "user@example.com",
                  name: "John Doe",
                },
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      ],
    },
    {
      id: "register",
      method: "POST",
      path: "/auth/register",
      title: "User Registration",
      description: "Register a new user account",
      category: "auth",
      tags: ["authentication", "registration"],
      requestBody: {
        required: true,
        description: "Registration data",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          required: ["name", "email", "password"],
        },
        example: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        },
      },
      responses: [
        {
          statusCode: 201,
          description: "User created successfully",
          contentType: "application/json",
          example: {
            success: true,
            data: {
              user: {
                id: "123",
                name: "John Doe",
                email: "john@example.com",
              },
            },
          },
        },
      ],
    },
  ],
};
