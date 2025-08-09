import React from "react";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";

interface Props {
  searchParams: {
    page?: string;
    tag?: string;
    search?: string;
  };
}

/**
 * Fetch paginated published blog posts from our internal API.
 * Uses absolute URL derived from the current request headers to work in server components.
 */
async function getPosts(params: { page?: string; tag?: string; search?: string }) {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page);
    if (params.tag) searchParams.set("tag", params.tag);
    if (params.search) searchParams.set("search", params.search);

    // Build absolute URL for server-side fetch
    const hdrs = await headers();
    const host = hdrs.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const apiUrl = `${protocol}://${host}/api/posts${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    const response = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("API response not ok:", response.status, response.statusText);
      return { posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON:", contentType);
      return { posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  }
}

export default async function BlogListPage({ searchParams }: Props) {
  const { posts, pagination } = await getPosts(searchParams);
  const currentSearch = searchParams.search || "";
  const currentTag = searchParams.tag || "";
  const startIndex = posts.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endIndex = posts.length > 0 ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <MaxWidthWrapper className="max-w-screen-lg">
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>

        {/* Search */}
        <form action="/blog" method="get" className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-white placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {currentTag && <input type="hidden" name="tag" value={currentTag} />}
            <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Search
            </button>
          </div>
        </form>

        {/* Result summary */}
        {pagination.total > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {startIndex}-{endIndex} of {pagination.total}
            {currentSearch && (
              <>
                {" "}
                results for <span className="font-medium text-gray-800">“{currentSearch}”</span>
              </>
            )}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No posts found</h2>
            <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post: any) => (
              <article key={post.id} className="border-b border-gray-900 pb-8">
                <div className="flex items-start gap-6">
                  {post.coverImage && (
                    <div className="flex-shrink-0">
                      <img src={post.coverImage} alt={post.title} className="w-48 h-32 object-cover rounded-lg" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        {post.author.avatar && <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />}
                        <span>{post.author.name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                      {post._count && (
                        <>
                          <span>•</span>
                          <span>{post._count.likes} likes</span>
                        </>
                      )}
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
                    </Link>

                    {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag: any) => (
                          <span key={tag.id} className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-10">
            {/* Prev */}
            {pagination.page > 1 ? (
              <Link href={`/blog?page=${pagination.page - 1}${currentTag ? `&tag=${currentTag}` : ""}${currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""}`} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-400">Previous</span>
            )}

            {/* Page numbers */}
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}${currentTag ? `&tag=${currentTag}` : ""}${currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""}`}
                  className={`px-3 py-2 rounded-lg ${page === pagination.page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  {page}
                </Link>
              ))}
            </div>

            {/* Next */}
            {pagination.page < pagination.pages ? (
              <Link href={`/blog?page=${pagination.page + 1}${currentTag ? `&tag=${currentTag}` : ""}${currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""}`} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                Next
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-400">Next</span>
            )}
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
