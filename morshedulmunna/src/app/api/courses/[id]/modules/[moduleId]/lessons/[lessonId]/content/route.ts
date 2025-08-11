import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/[id]/modules/[moduleId]/lessons/[lessonId]/content
 * Fetch all content for a lesson
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }) {
  try {
    const { id, moduleId, lessonId } = await params;

    const contents = await prisma.lessonContent.findMany({
      where: {
        lessonId: lessonId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Error fetching lesson content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/courses/[id]/modules/[moduleId]/lessons/[lessonId]/content
 * Add content to a lesson
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId, lessonId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, url, size, filename } = body;

    // Validate required fields
    if (!title || !type || !url || !filename) {
      return NextResponse.json({ error: "Title, type, url, and filename are required" }, { status: 400 });
    }

    const content = await prisma.lessonContent.create({
      data: {
        title,
        type,
        url,
        size: size || 0,
        filename,
        lessonId: lessonId,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("Error adding content to lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
