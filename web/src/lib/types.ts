export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  slug: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  viewCount: number;
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
  };
  tags?: Array<{
    name: string;
  }>;
  _count?: {
    likes: number;
    comments: number;
  };
}

export type ResponseType = {
  success: boolean;
  message: string;
  data?: any;
  status?: number;
  details?: any;
  isAxiosError?: boolean;
};

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseReview {
  id: string;
  rating: number;
  comment?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  createdAt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order?: number;
  lessons?: Array<{
    id: string;
    title: string;
    videoUrl?: string;
    duration?: number;
  }>;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  duration?: string;
  lessons?: number;
  students?: number;
  viewCount?: number;
  instructor?: {
    name: string;
    avatar?: string;
  };
  modules?: CourseModule[];
  reviews?: Array<{
    rating: number;
    comment?: string;
  }>;
  outcomes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogResponse {
  posts: Post[];
  pagination: BlogPagination;
}
