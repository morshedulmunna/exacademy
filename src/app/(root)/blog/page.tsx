import React from "react";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    search?: string;
  }>;
}

async function getPosts(params: {
  page?: string;
  tag?: string;
  search?: string;
}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.search) searchParams.set('search', params.search);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts?${searchParams}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return { posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  }
}

export default async function BlogListPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { posts, pagination } = await getPosts(resolvedSearchParams);

  return (
    <MaxWidthWrapper className="max-w-screen-lg">
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No posts found</h2>
            <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post: any) => (
              <article key={post.id} className="border-b border-gray-200 pb-8">
                <div className="flex items-start gap-6">
                  {post.coverImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        {post.author.avatar && (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
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
                      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag: any) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          >
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
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}${resolvedSearchParams.tag ? `&tag=${resolvedSearchParams.tag}` : ''}${resolvedSearchParams.search ? `&search=${resolvedSearchParams.search}` : ''}`}
                  className={`px-4 py-2 rounded-lg ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
