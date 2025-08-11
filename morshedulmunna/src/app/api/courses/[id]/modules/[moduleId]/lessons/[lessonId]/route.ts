import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/[id]/modules/[moduleId]/lessons/[lessonId]
 * Fetch a specific lesson
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId, lessonId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        moduleId: moduleId,
      },
      include: {
        contents: true,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/courses/[id]/modules/[moduleId]/lessons/[lessonId]
 * Update a lesson
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId, lessonId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, content, videoUrl, duration, order, isFree, published, moduleId: newModuleId } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Lesson title is required" }, { status: 400 });
    }

    // If moving to a different module, handle the move
    if (newModuleId && newModuleId !== moduleId) {
      const lesson = await prisma.lesson.update({
        where: {
          id: lessonId,
          moduleId: moduleId,
        },
        data: {
          title,
          description,
          content,
          videoUrl,
          duration: duration || "0m",
          order: order || 1,
          isFree: isFree || false,
          published: published || false,
          moduleId: newModuleId,
        },
        include: {
          contents: true,
        },
      });

      return NextResponse.json(lesson);
    }

    // Update in the same module
    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
        moduleId: moduleId,
      },
      data: {
        title,
        description,
        content,
        videoUrl,
        duration: duration || "0m",
        order: order || 1,
        isFree: isFree || false,
        published: published || false,
      },
      include: {
        contents: true,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/courses/[id]/modules/[moduleId]/lessons/[lessonId]
 * Delete a lesson
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId, lessonId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete lesson (contents will be deleted due to cascade)
    await prisma.lesson.delete({
      where: {
        id: lessonId,
        moduleId: moduleId,
      },
    });

    // Update course lessons count
    await prisma.course.update({
      where: { id: id },
      data: {
        lessons: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
