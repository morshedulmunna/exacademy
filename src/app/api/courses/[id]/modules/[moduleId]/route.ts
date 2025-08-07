import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/[id]/modules/[moduleId]
 * Fetch a specific module
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const module = await prisma.courseModule.findUnique({
      where: {
        id: moduleId,
        courseId: id,
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
          include: {
            contents: true,
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/courses/[id]/modules/[moduleId]
 * Update a module
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, order } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Module title is required" }, { status: 400 });
    }

    const module = await prisma.courseModule.update({
      where: {
        id: moduleId,
        courseId: id,
      },
      data: {
        title,
        description,
        order,
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/courses/[id]/modules/[moduleId]
 * Delete a module
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id, moduleId } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.courseModule.delete({
      where: {
        id: moduleId,
        courseId: id,
      },
    });

    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
