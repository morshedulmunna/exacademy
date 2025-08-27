import React from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, MoreHorizontal, Calendar, User } from "lucide-react";

interface Author {
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  author: Author;
  tags: string[];
  viewCount: number;
  readTime: number;
}

interface PostTableProps {
  posts: Post[];
}

/**
 * Blog posts table component
 */
export const PostTable: React.FC<PostTableProps> = ({ posts }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Post</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * Individual post row component
 */
const PostRow: React.FC<{ post: Post }> = ({ post }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {post.title.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
          <div className="text-sm text-wrap text-gray-500 dark:text-gray-400 max-w-xs truncate">{post.excerpt}</div>
          <div className="flex items-center space-x-2 mt-1">
            {post.tags.map((tag, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <User className="w-4 h-4 text-gray-400 mr-2" />
        <div>
          <div className="text-sm text-gray-900 dark:text-white">{post.author?.name || "Unknown"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{post.author?.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.published ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
        {post.published ? "Published" : "Draft"}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{post.viewCount.toLocaleString()}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{post.readTime} min read</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
        <div className="text-sm text-gray-900 dark:text-white">{new Date(post.createdAt).toLocaleDateString()}</div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center space-x-2">
        <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View">
          <Eye className="w-4 h-4" />
        </Link>
        <Link href={`/admin/blog/${post.slug}/edit`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Edit">
          <Edit className="w-4 h-4" />
        </Link>
        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="More">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

