/**
 * TypeScript types for the content management system
 */

export interface User {
  id: string
  email: string
  name: string
  username: string
  bio?: string
  avatar?: string
  website?: string
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  published: boolean
  featured: boolean
  readTime: number
  viewCount: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  author: User
  tags: Tag[]
  _count?: {
    comments: number
    likes: number
  }
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

export interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: User
  post: Post
}

export interface Like {
  id: string
  createdAt: Date
  user: User
  post: Post
}

export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  published?: boolean
  featured?: boolean
  tagIds?: string[]
}

export interface UpdatePostData {
  title?: string
  content?: string
  excerpt?: string
  coverImage?: string
  published?: boolean
  featured?: boolean
  tagIds?: string[]
} 