import React from "react";
import { Button } from "../ui/button";
import SmallArticleCard from "./SmallArticleCard";
import FeaturesBlogCard from "./FeaturesBlogCard";
import Link from "next/link";
import { munna_image } from "@/assets";

// Sample blog data
const featuredBlogs = [
  {
    title: "Step by Step Setup Server with Nginex SSL Enable in ubontu",
    description: "This guide walks through deploying any full-stack JavaScript application (Next.js frontend + NestJS backend) on a fresh Ubuntu server (20.04+).",
    excerpt: "Complete guide to setting up a production server with Nginx and SSL certificates on Ubuntu for deploying full-stack applications.",
    date: "Apr 15, 2025",
    publishedAt: "2025-04-15T10:00:00Z",
    updatedAt: "2025-04-15T10:00:00Z",
    readTime: "3 min read",
    readingTime: 3,
    category: "DevOps",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1746002315208/073543eb-01f5-4cc7-a0fd-f45f7ba7d5e0.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    url: "https://morshedulmunna.hashnode.dev/step-by-step-setup-server-with-nginex-ssl-enable-in-ubontu",
    slug: "step-by-step-setup-server-with-nginex-ssl-enable-in-ubontu",
    likes: 45,
    comments: 12,
    views: 1250,
    tags: ["DevOps", "Ubuntu", "Nginx", "SSL", "Deployment", "Server Setup"],
    featured: true,
    status: "published",
  },
  {
    title: "Mastering JavaScript fundamentals",
    description: "Dive deep into TypeScript's advanced features and learn how to write more maintainable and type-safe code. We'll explore generics, utility types, and advanced patterns.",
    excerpt: "Comprehensive guide to JavaScript fundamentals covering core concepts, best practices, and advanced techniques for modern web development.",
    date: "May 10, 2025",
    publishedAt: "2025-05-10T14:30:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
    readTime: "15 min read",
    readingTime: 15,
    category: "JavaScript",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    url: "https://morshedulmunna.hashnode.dev/javascript-dev-fundamental",
    slug: "javascript-dev-fundamental",
    likes: 78,
    comments: 23,
    views: 2100,
    tags: ["JavaScript", "Fundamentals", "Web Development", "Programming"],
    featured: true,
    status: "published",
  },
];

const smallBlogs = [
  {
    title: "Understanding the Promise API in JavaScript",
    description: "The Promise API in JavaScript provides methods to handle multiple promises concurrently. These methods—Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()—are powerful tools for managing asynchronous operations. Let's explore each in detail.",
    excerpt: "Deep dive into JavaScript Promise API methods for handling concurrent asynchronous operations effectively.",
    date: "Dec 5, 2024",
    publishedAt: "2024-12-05T09:15:00Z",
    updatedAt: "2024-12-05T09:15:00Z",
    readTime: "4 min read",
    readingTime: 4,
    tags: ["javascript", "promise", "async", "await"],
    url: "https://morshedulmunna.hashnode.dev/understanding-the-promise-api-in-javascript",
    slug: "understanding-the-promise-api-in-javascript",
    likes: 32,
    comments: 8,
    views: 890,
    category: "JavaScript",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "React Performance Optimization Techniques",
    description: "Learn how to optimize your React applications for better performance and user experience.",
    excerpt: "Essential techniques and best practices for optimizing React application performance and improving user experience.",
    date: "Dec 3, 2024",
    publishedAt: "2024-12-03T11:45:00Z",
    updatedAt: "2024-12-03T11:45:00Z",
    readTime: "10 min read",
    readingTime: 10,
    tags: ["React", "Performance"],
    url: "https://www.youtube.com/@morshedulmunna1",
    slug: "react-performance-optimization-techniques",
    likes: 56,
    comments: 15,
    views: 1450,
    category: "React",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "Building REST APIs with Node.js and Express",
    description: "A comprehensive guide to building robust and scalable REST APIs using Node.js and Express.",
    excerpt: "Complete tutorial on creating production-ready REST APIs using Node.js and Express framework with best practices.",
    date: "Nov 28, 2024",
    publishedAt: "2024-11-28T16:20:00Z",
    updatedAt: "2024-11-28T16:20:00Z",
    readTime: "12 min read",
    readingTime: 12,
    tags: ["Node.js", "Express", "API"],
    url: "https://www.youtube.com/@morshedulmunna1",
    slug: "building-rest-apis-with-nodejs-and-express",
    likes: 43,
    comments: 11,
    views: 1120,
    category: "Backend",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "Getting Started with GraphQL",
    description: "Learn the basics of GraphQL and how to implement it in your applications.",
    excerpt: "Introduction to GraphQL fundamentals and practical implementation guide for modern applications.",
    date: "Nov 25, 2024",
    publishedAt: "2024-11-25T13:10:00Z",
    updatedAt: "2024-11-25T13:10:00Z",
    readTime: "8 min read",
    readingTime: 8,
    tags: ["GraphQL", "API"],
    url: "https://www.youtube.com/@morshedulmunna1",
    slug: "getting-started-with-graphql",
    likes: 28,
    comments: 6,
    views: 750,
    category: "API",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "Advanced TypeScript Patterns",
    description: "Explore advanced TypeScript patterns and techniques for building scalable applications.",
    excerpt: "Master advanced TypeScript patterns including generics, decorators, and utility types for enterprise applications.",
    date: "Nov 22, 2024",
    publishedAt: "2024-11-22T10:30:00Z",
    updatedAt: "2024-11-22T10:30:00Z",
    readTime: "14 min read",
    readingTime: 14,
    tags: ["TypeScript", "Advanced Patterns", "Generics"],
    url: "https://www.youtube.com/@morshedulmunna1",
    slug: "advanced-typescript-patterns",
    likes: 67,
    comments: 18,
    views: 1680,
    category: "TypeScript",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "Docker for Beginners",
    description: "A beginner-friendly guide to Docker containerization and deployment strategies.",
    excerpt: "Learn Docker basics, containerization concepts, and deployment strategies for modern applications.",
    date: "Nov 20, 2024",
    publishedAt: "2024-11-20T15:45:00Z",
    updatedAt: "2024-11-20T15:45:00Z",
    readTime: "9 min read",
    readingTime: 9,
    tags: ["Docker", "Containerization", "DevOps"],
    url: "https://www.youtube.com/@morshedulmunna1",
    slug: "docker-for-beginners",
    likes: 39,
    comments: 9,
    views: 920,
    category: "DevOps",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1733674741539/29f8776f-89b5-4aa6-b47b-c1a0c67321f5.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
];

export default function Blogs() {
  return (
    <>
      {/* Blogs */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
              <p className="text-gray-400">Sharing insights on software engineering, tech trends, and development practices.</p>
            </div>
            <Link href="https://morshedulmunna.hashnode.dev" target="_blank" className="bg-white hover:text-cyan-500 font-medium text-black px-4 py-2 rounded-md text-sm md:flex">
              View All Posts
            </Link>
          </div>

          {/* Updated Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Featured Blog Post (Left Column) */}
            <div className="lg:col-span-2">
              {featuredBlogs.map((blog, index) => (
                <FeaturesBlogCard key={index} {...blog} />
              ))}
            </div>

            {/* Right Column with Smaller Posts */}
            <div className="flex flex-col gap-4">
              {smallBlogs.map((blog, index) => (
                <SmallArticleCard key={index} {...blog} />
              ))}
            </div>
          </div>

          {/* Mobile View All Button */}
          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="outline">View All Posts</Button>
          </div>
        </div>
      </section>
    </>
  );
}
