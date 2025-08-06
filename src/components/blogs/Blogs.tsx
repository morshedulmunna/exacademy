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
    title: "React Functional Component Lifecycle: A Simple Guide with Hooks",
    description: `If you're building things with React and using functional components, you might have heard about the "component lifecycle." In simpler terms, it's like understanding the different phases of a component's life – from birth to changes and finally saying goodbye. Let's walk through these phases using hooks, the functional component's way of handling things.`,
    excerpt: `If you're building things with React and using functional components, you might have heard about the "component lifecycle." In simpler terms, it's like understanding the different phases of a component's life – from birth to changes and finally saying goodbye. Let's walk through these phases using hooks, the functional component's way of handling things.`,
    date: "Jun 18, 2025",
    publishedAt: "2025-06-18T09:15:00Z",
    updatedAt: "2025-06-18T09:15:00Z",
    readTime: "4 min read",
    readingTime: 4,
    tags: ["javascript", "react", "hooks", "lifecycle"],
    url: "https://morshedulmunna.hashnode.dev/embracing-the-react-functional-component-lifecycle-a-simple-guide-with-hooks",
    slug: "embracing-the-react-functional-component-lifecycle-a-simple-guide-with-hooks",
    likes: 32,
    comments: 8,
    views: 890,
    category: "React",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1706372949601/d690ea20-ced6-4668-9204-15e295f658dd.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "Typesense:- Alternative of Elasticsearch",
    description: `Typesense is an open-source search engine designed to be fast, user-friendly, and tolerant of typos. It's popular among developers for its simplicity and speed. It supports features like typo correction, multilingual search, filtering, and an easy-to-use API. It's used in various applications, particularly in scenarios where efficient and accurate search functionality is crucial, such as e-commerce sites, forums, and marketplaces.`,
    excerpt: `Typesense is an open-source search engine designed to be fast, user-friendly, and tolerant of typos. It's popular among developers for its simplicity and speed. It supports features like typo correction, multilingual search, filtering, and an easy-to-use API. It's used in various applications, particularly in scenarios where efficient and accurate search functionality is crucial, such as e-commerce sites, forums, and marketplaces.`,
    date: "Jun 18, 2025",
    publishedAt: "2025-06-18T11:45:00Z",
    updatedAt: "2025-06-18T11:45:00Z",
    readTime: "5 min read",
    readingTime: 5,
    tags: ["typesense", "elasticsearch", "search", "search-engine"],
    url: "https://morshedulmunna.hashnode.dev/typesense-alternative-of-elasticsearch",
    slug: "typesense-alternative-of-elasticsearch",
    likes: 56,
    comments: 15,
    views: 1450,
    category: "Database",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1702548403617/f2c46a57-c3b4-4da0-909f-bdb581288e65.webp?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "What is a callback in JavaScript with an Example?",
    description: `In JavaScript, a callback function is a function that is passed as an argument to another function and is executed after some kind of event or operation has been completed. This allows the developer to write code that is executed at a later time, rather than in a blocking manner.
     A callback function is a function that is "called back" at a later time after some operation has been completed. It is passed as an argument to another function, which is responsible for executing the callback when the operation is complete.`,
    excerpt: `In JavaScript, a callback function is a function that is passed as an argument to another function and is executed after some kind of event or operation has been completed. This allows the developer to write code that is executed at a later time, rather than in a blocking manner.
    A callback function is a function that is "called back" at a later time after some operation has been completed. It is passed as an argument to another function, which is responsible for executing the callback when the operation is complete.`,
    date: "Jun 18, 2024",
    publishedAt: "2025-06-18T16:20:00Z",
    updatedAt: "2025-06-18T16:20:00Z",
    readTime: "4 min read",
    readingTime: 4,
    tags: ["javascript", "callback", "function"],
    url: "https://morshedulmunna.hashnode.dev/callback-js",
    slug: "callback-js",
    likes: 43,
    comments: 11,
    views: 1120,
    category: "JavaScript",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1673852477366/ca393279-7840-4701-afad-05e1465fe1bb.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    featured: false,
    status: "published",
  },
  {
    title: "Connect Rust lib + Web Assembly + React.js(typescript)",
    description: `In this article, we'll explore how to connect a Rust library with WebAssembly (Wasm) and React.js (TypeScript) to create a powerful and efficient web application. We'll cover the basics of Rust, WebAssembly, and React, and how to integrate them together.`,
    excerpt: `In this article, we'll explore how to connect a Rust library with WebAssembly (Wasm) and React.js (TypeScript) to create a powerful and efficient web application. We'll cover the basics of Rust, WebAssembly, and React, and how to integrate them together.`,
    date: "Jun 10, 2023",
    publishedAt: "2025-06-18T13:10:00Z",
    updatedAt: "2025-06-18T13:10:00Z",
    readTime: "3 min read",
    readingTime: 3,
    tags: ["rust", "webassembly", "react", "typescript"],
    url: "https://morshedulmunna.hashnode.dev/how-to-connect-rust-lib-web-assembly-reactjstypescript",
    slug: "connect-rust-lib-web-assembly-reactjs-typescript",
    likes: 28,
    comments: 6,
    views: 750,
    category: "Rust",
    author: "Morshedul Munna",
    authorImage: munna_image,
    imageUrl: "https://cdn.hashnode.com/res/hashnode/image/upload/v1673372201953/10182b09-804b-40cd-adcf-84ce98635198.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
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
              <h2 className="text-3xl font-bold mb-4 text-foreground">Latest Blog Posts</h2>
              <p className="text-muted-foreground">Sharing insights on software engineering, tech trends, and development practices.</p>
            </div>
            <Link href="https://morshedulmunna.hashnode.dev" target="_blank" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md text-sm md:flex transition-colors">
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
