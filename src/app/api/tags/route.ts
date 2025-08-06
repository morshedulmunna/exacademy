import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

/**
 * GET /api/tags
 * Get all tags
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withCount = searchParams.get("withCount") === "true";

    const tags = await prisma.tag.findMany({
      include: withCount
        ? {
            _count: {
              select: {
                posts: {
                  where: {
                    post: {
                      published: true,
                    },
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: withCount
        ? {
            posts: {
              _count: "desc",
            },
          }
        : {
            name: "asc",
          },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

/**
 * POST /api/tags
 * Create a new tag
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color = "#3B82F6" } = body;

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    const slug = generateSlug(name);

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
