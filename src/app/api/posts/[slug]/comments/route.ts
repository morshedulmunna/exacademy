import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

/**
 * GET /api/posts/[slug]/comments
 * Returns the list of comments for a post identified by slug.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: post.id, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

/**
 * POST /api/posts/[slug]/comments
 * Creates a new comment for a post (requires authentication).
 * Body: { content: string }
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await requireAuth();
    const { slug } = await params;
    const { content, parentId } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If replying, validate parent belongs to the same post
    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId }, select: { id: true, postId: true } });
      if (!parent || parent.postId !== post.id) {
        return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
      }
    }

    const created = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        postId: post.id,
        parentId: parentId ?? null,
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error?.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

/**
 * PATCH /api/posts/[slug]/comments
 * Updates an existing comment owned by the current user.
 * Body: { id: string, content: string }
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await requireAuth();
    const { slug } = await params;
    const { id, content } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Comment id is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const existing = await prisma.comment.findUnique({ where: { id }, select: { id: true, authorId: true, postId: true } });
    if (!existing || existing.postId !== post.id) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (existing.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content: content.trim() },
      include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/[slug]/comments?id=commentId
 * Deletes a comment owned by the current user. If it is a top-level comment,
 * also deletes its direct replies.
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await requireAuth();
    const { slug } = await params;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Comment id is required" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const existing = await prisma.comment.findUnique({ where: { id }, select: { id: true, authorId: true, parentId: true, postId: true } });
    if (!existing || existing.postId !== post.id) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (existing.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existing.parentId) {
      await prisma.comment.delete({ where: { id } });
    } else {
      await prisma.$transaction([prisma.comment.deleteMany({ where: { parentId: id } }), prisma.comment.delete({ where: { id } })]);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error?.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
