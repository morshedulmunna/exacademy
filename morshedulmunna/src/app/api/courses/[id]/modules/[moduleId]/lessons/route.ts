import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/[id]/modules/[moduleId]/lessons
 * Fetch all lessons for a module
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const { id, moduleId } = await params;

    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId: moduleId,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        contents: true,
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/courses/[id]/modules/[moduleId]/lessons
 * Create a new lesson
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, content, videoUrl, duration, order, isFree, published } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Lesson title is required" }, { status: 400 });
    }

    // Get the next order if not provided
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId: moduleId },
        orderBy: { order: "desc" },
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        videoUrl,
        duration: duration || "0m",
        order: lessonOrder,
        isFree: isFree || false,
        published: published || false,
        moduleId: moduleId,
      },
      include: {
        contents: true,
      },
    });

    // Update course lessons count
    await prisma.course.update({
      where: { id: id },
      data: {
        lessons: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
