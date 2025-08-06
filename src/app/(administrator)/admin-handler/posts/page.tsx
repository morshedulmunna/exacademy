"use client";

import React, { useState, useEffect } from "react";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  publishedAt?: string | null;
  author: {
    name: string;
  };
  _count: {
    views: number;
    likes: number;
  };
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts?limit=50");
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (postId: string, published: boolean) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !published,
          publishedAt: !published ? new Date() : null,
        }),
      });

      if (response.ok) {
        setPosts(posts.map((p) => (p.id === postId ? { ...p, published: !published, publishedAt: !published ? new Date().toISOString() : undefined } : p)));
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const toggleFeatured = async (postId: string, featured: boolean) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !featured,
        }),
      });

      if (response.ok) {
        setPosts(posts.map((p) => (p.id === postId ? { ...p, featured: !featured } : p)));
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Posts</h1>
          <Link href="/admin-handler/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Post
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{post.published ? "Published" : "Draft"}</span>
                      {post.featured && <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Featured</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(post.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post._count?.views || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                      <Link href={`/admin-handler/posts/${post.slug}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                      <button onClick={() => togglePublish(post.id, post.published)} className={`${post.published ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}`}>
                        {post.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => toggleFeatured(post.id, post.featured)} className={`${post.featured ? "text-gray-600 hover:text-gray-900" : "text-purple-600 hover:text-purple-900"}`}>
                        {post.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
