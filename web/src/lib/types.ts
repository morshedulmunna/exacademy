/**
 * TypeScript types for the content management system
 */

// Auth types removed for static UI build

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
// Session/User/JWT augmentations removed

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
  outcomes?: string[];
  _count?: {
    enrollments: number;
  };
  // Optional nested relations when fully loading a course
  modules?: CourseModule[];
  enrollments?: Array<{
    id: string;
    user: Pick<User, "id" | "name" | "avatar">;
  }>;
  reviews?: CourseReview[];
  relatedCourses?: Course[];
}

export interface LessonContent {
  id: string;
  title: string;
  type: "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE" | "AUDIO" | "OTHER";
  url: string;
  size?: number;
  filename: string;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration: string; // e.g., "15 min" or "10m"
  order: number;
  isFree: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  contents: LessonContent[];
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  lessons: Lesson[];
}

export interface CourseEnrollment {
  id: string;
  enrolledAt: Date;
  completed: boolean;
  progress: number;
  user: User;
  course: Course;
}

export interface CourseReview {
  id: string;
  rating: number; // 1-5
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, "id" | "name" | "avatar">;
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
