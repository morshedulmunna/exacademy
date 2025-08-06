import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug, calculateReadTime, extractExcerpt } from "@/lib/utils";
import { CreatePostData } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-utils";

/**
 * GET /api/posts
 * Get all published posts with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      published: true,
    };

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (featured) {
      where.featured = true;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
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
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // Transform posts to flatten tags
    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((postTag: any) => postTag.tag),
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin role for creating posts
    const user = await requireAdmin();

    const body: CreatePostData = await request.json();
    const { title, content, excerpt, coverImage, published = false, featured = false, tagIds = [] } = body;

    // Generate slug from title
    const slug = generateSlug(title);

    // Calculate read time
    const readTime = calculateReadTime(content);

    // Extract excerpt if not provided
    const postExcerpt = excerpt || extractExcerpt(content);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: postExcerpt,
        coverImage,
        published,
        featured,
        readTime,
        publishedAt: published ? new Date() : null,
        authorId: user.id,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Transform post to flatten tags
    const transformedPost = {
      ...post,
      tags: post.tags.map((postTag: any) => postTag.tag),
    };

    return NextResponse.json(transformedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
