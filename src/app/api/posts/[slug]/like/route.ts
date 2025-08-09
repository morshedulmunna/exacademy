import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

/**
 * POST /api/posts/[slug]/like
 * Toggle like for the current user on the given post.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await requireAuth();
    const { slug } = await params;

    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: { userId: user.id, postId: post.id },
      },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_postId: { userId: user.id, postId: post.id } } });
      const count = await prisma.like.count({ where: { postId: post.id } });
      return NextResponse.json({ liked: false, likes: count });
    }

    await prisma.like.create({ data: { userId: user.id, postId: post.id } });
    const count = await prisma.like.count({ where: { postId: post.id } });
    return NextResponse.json({ liked: true, likes: count });
  } catch (error: any) {
    if (error?.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

/**
 * GET /api/posts/[slug]/like
 * Returns whether current user liked the post and total like count.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // not strictly required to be authenticated to view counts
    let liked = false;
    try {
      const user = await requireAuth();
      const existing = await prisma.like.findUnique({ where: { userId_postId: { userId: user.id, postId: post.id } } });
      liked = Boolean(existing);
    } catch (_) {
      liked = false;
    }

    const count = await prisma.like.count({ where: { postId: post.id } });
    return NextResponse.json({ liked, likes: count });
  } catch (error) {
    console.error("Error fetching like state:", error);
    return NextResponse.json({ error: "Failed to fetch like state" }, { status: 500 });
  }
}
