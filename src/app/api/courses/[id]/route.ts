import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/[id]
 * Fetch a specific course by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
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
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[id]
 * Update a specific course
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      excerpt,
      price,
      originalPrice,
      duration,
      lessons,
      thumbnail,
      published,
      featured,
      tagIds = [],
    } = body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current course)
    if (slug && slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Course with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        excerpt,
        price: price !== undefined ? parseFloat(price) : undefined,
        originalPrice: originalPrice !== undefined ? parseFloat(originalPrice) : null,
        duration,
        lessons: lessons !== undefined ? parseInt(lessons) : undefined,
        thumbnail,
        published,
        featured,
        publishedAt: published && !existingCourse.published ? new Date() : existingCourse.publishedAt,
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
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
            enrollments: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[id]
 * Delete a specific course
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete course (cascade will handle related records)
    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
