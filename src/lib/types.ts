/**
 * TypeScript types for the content management system
 */

import { DefaultSession } from "next-auth";

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extend NextAuth session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: UserRole;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: UserRole;
    avatar?: string;
  }
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  featured: boolean;
  readTime: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  author: User;
  tags: Tag[];
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  duration: string;
  lessons: number;
  students: number;
  published: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  instructor: User;
  tags: Tag[];
  _count?: {
    enrollments: number;
  };
}

export interface CourseEnrollment {
  id: string;
  enrolledAt: Date;
  completed: boolean;
  progress: number;
  user: User;
  course: Course;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  post: Post;
}

export interface Like {
  id: string;
  createdAt: Date;
  user: User;
  post: Post;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  featured?: boolean;
  tagIds?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  featured?: boolean;
  tagIds?: string[];
}
