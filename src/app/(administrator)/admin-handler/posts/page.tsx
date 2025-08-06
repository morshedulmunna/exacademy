import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import Link from "next/link";

/**
 * Admin Posts Management Page
 * Only accessible to users with ADMIN role
 */
export default async function AdminPostsPage() {
  const user = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all posts with author information
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen  py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Posts</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Create, edit, and manage your blog posts</p>
          </div>
          <Link href="/admin-handler/posts/new" className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Create New Post
          </Link>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-900/20 shadow dark:shadow-gray-900/20 rounded-lg overflow-hidden transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">All Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-900">
              <thead className="bg-gray-50 dark:bg-gray-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {post.coverImage ? (
                            <img className="h-10 w-10 rounded-lg object-cover" src={post.coverImage} alt={post.title} />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{post.author.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">@{post.author.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.published ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                      {post.featured && <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">Featured</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{post.viewCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin-handler/posts/${post.id}/edit`} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                          Edit
                        </Link>
                        <Link href={`/blog/${post.slug}`} className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors">
                          View
                        </Link>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                          onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete post:", post.id);
                          }}
                        >
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
      </div>
    </div>
  );
}
