import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/by-slug/[slug]
 * Fetch a specific course by slug
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: { contents: true },
            },
          },
        },
        tags: { include: { tag: true } },
        enrollments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Reviews
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: course.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Related courses by instructor (basic): latest 6 excluding current
    const relatedCourses = await prisma.course.findMany({
      where: { instructorId: course.instructorId, id: { not: course.id }, published: true },
      include: {
        instructor: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    // Flatten nested structures to easier-to-consume shapes
    const transformed = {
      ...(course as any),
      tags: (course as any).tags.map((ct: any) => ct.tag),
      reviews,
      relatedCourses: relatedCourses.map((rc: any) => ({
        ...rc,
        tags: rc.tags.map((t: any) => t.tag),
      })),
    } as any;

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
