import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

/**
 * GET /api/courses/[id]/modules
 * Fetch all modules for a course
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const modules = await prisma.courseModule.findMany({
      where: {
        courseId: id,
      },
      orderBy: {
        order: "asc",
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

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/courses/[id]/modules
 * Create a new module
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, order } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Module title is required" }, { status: 400 });
    }

    // Get the next order if not provided
    let moduleOrder = order;
    if (!moduleOrder) {
      const lastModule = await prisma.courseModule.findFirst({
        where: { courseId: id },
        orderBy: { order: "desc" },
      });
      moduleOrder = lastModule ? lastModule.order + 1 : 1;
    }

    const module = await prisma.courseModule.create({
      data: {
        title,
        description,
        order: moduleOrder,
        courseId: id,
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
