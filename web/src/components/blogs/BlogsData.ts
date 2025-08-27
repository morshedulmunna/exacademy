import { Post, BlogResponse } from "../../lib/types";

/**
 * Dummy blog data for development and testing
 */
export const dummyPosts: Post[] = [
  {
    id: "1",
    title: "The Future of Web Development: What's Next in 2024",
    excerpt: "Explore the latest trends in web development, from AI-powered tools to new frameworks that are reshaping how we build the web.",
    slug: "future-web-development-2024",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    featured: true,
    published: true,
    viewCount: 15420,
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "Web Development" }, { name: "Technology" }, { name: "Trends" }],
    _count: {
      likes: 342,
      comments: 89,
    },
  },
  {
    id: "2",
    title: "Mastering TypeScript: Advanced Patterns for Better Code",
    excerpt: "Learn advanced TypeScript patterns that will make your code more maintainable, type-safe, and easier to refactor.",
    slug: "mastering-typescript-advanced-patterns",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    publishedAt: "2024-01-12T14:30:00Z",
    createdAt: "2024-01-12T14:30:00Z",
    readTime: 12,
    featured: true,
    published: true,
    viewCount: 12850,
    author: {
      name: "Michael Chen",
      username: "mchen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "TypeScript" }, { name: "Programming" }, { name: "Best Practices" }],
    _count: {
      likes: 298,
      comments: 67,
    },
  },
  {
    id: "3",
    title: "Building Scalable APIs with Rust and Actix",
    excerpt: "Discover how to build high-performance, scalable APIs using Rust and the Actix web framework.",
    slug: "building-scalable-apis-rust-actix",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    publishedAt: "2024-01-10T09:15:00Z",
    createdAt: "2024-01-10T09:15:00Z",
    readTime: 15,
    featured: false,
    published: true,
    viewCount: 8920,
    author: {
      name: "Alex Rodriguez",
      username: "alexr",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "Rust" }, { name: "API Development" }, { name: "Backend" }],
    _count: {
      likes: 156,
      comments: 34,
    },
  },
  {
    id: "4",
    title: "React Performance Optimization: A Complete Guide",
    excerpt: "Learn the best practices for optimizing React applications, from code splitting to memoization techniques.",
    slug: "react-performance-optimization-guide",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    publishedAt: "2024-01-08T16:45:00Z",
    createdAt: "2024-01-08T16:45:00Z",
    readTime: 10,
    featured: false,
    published: true,
    viewCount: 11230,
    author: {
      name: "Emily Davis",
      username: "emilyd",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "React" }, { name: "Performance" }, { name: "Frontend" }],
    _count: {
      likes: 234,
      comments: 52,
    },
  },
  {
    id: "5",
    title: "Database Design Principles for Modern Applications",
    excerpt: "Master the fundamentals of database design and learn how to create efficient, scalable data models.",
    slug: "database-design-principles-modern-applications",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
    publishedAt: "2024-01-05T11:20:00Z",
    createdAt: "2024-01-05T11:20:00Z",
    readTime: 14,
    featured: false,
    published: true,
    viewCount: 7650,
    author: {
      name: "David Kim",
      username: "davidk",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "Database" }, { name: "Design" }, { name: "Architecture" }],
    _count: {
      likes: 189,
      comments: 41,
    },
  },
  {
    id: "6",
    title: "DevOps Best Practices for Small Teams",
    excerpt: "Implement effective DevOps practices that work for small development teams without overwhelming complexity.",
    slug: "devops-best-practices-small-teams",
    coverImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
    publishedAt: "2024-01-03T13:10:00Z",
    createdAt: "2024-01-03T13:10:00Z",
    readTime: 9,
    featured: false,
    published: true,
    viewCount: 5430,
    author: {
      name: "Lisa Wang",
      username: "lisaw",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "DevOps" }, { name: "CI/CD" }, { name: "Team Management" }],
    _count: {
      likes: 123,
      comments: 28,
    },
  },
  {
    id: "7",
    title: "Machine Learning for Developers: Getting Started",
    excerpt: "A practical introduction to machine learning concepts and tools for software developers.",
    slug: "machine-learning-developers-getting-started",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    publishedAt: "2024-01-01T08:30:00Z",
    createdAt: "2024-01-01T08:30:00Z",
    readTime: 11,
    featured: false,
    published: true,
    viewCount: 6780,
    author: {
      name: "Robert Taylor",
      username: "robertt",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "Machine Learning" }, { name: "AI" }, { name: "Python" }],
    _count: {
      likes: 167,
      comments: 39,
    },
  },
  {
    id: "8",
    title: "Security Best Practices for Web Applications",
    excerpt: "Essential security practices every web developer should implement to protect their applications and users.",
    slug: "security-best-practices-web-applications",
    coverImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    publishedAt: "2023-12-28T15:45:00Z",
    createdAt: "2023-12-28T15:45:00Z",
    readTime: 13,
    featured: false,
    published: true,
    viewCount: 9230,
    author: {
      name: "Jennifer Lee",
      username: "jenniferl",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    tags: [{ name: "Security" }, { name: "Web Development" }, { name: "Best Practices" }],
    _count: {
      likes: 245,
      comments: 58,
    },
  },
];

/**
 * Fetches blog posts with filtering and pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Promise<BlogResponse> - Paginated blog posts response
 */
export async function fetchPosts(params: Record<string, string | number>): Promise<BlogResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { page = 1, limit = 10, featured } = params;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  let filteredPosts = dummyPosts;

  // Filter by featured if specified
  if (featured === "true") {
    filteredPosts = dummyPosts.filter((post) => post.featured);
  } else if (featured === "false") {
    filteredPosts = dummyPosts.filter((post) => !post.featured);
  }

  // Calculate pagination
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredPosts.length,
      pages: Math.ceil(filteredPosts.length / limitNum),
    },
  };
}
