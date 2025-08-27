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

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BlogResponse {
  posts: Post[];
  pagination: BlogPagination;
}
