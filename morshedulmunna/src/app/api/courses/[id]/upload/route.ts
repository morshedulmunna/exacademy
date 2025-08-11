import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { FileUploader } from "@/lib/file-upload";

// Using the Web File API via request.formData() for handling multipart/form-data in App Router

/**
 * POST /api/courses/[id]/upload
 * Upload course content file
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure upload directories exist
    await FileUploader.ensureDirectories();

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const lessonId = formData.get("lessonId")?.toString();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Express.Multer.File format
    const buffer = await file.arrayBuffer();
    const multerFile: Express.Multer.File = {
      fieldname: "file",
      originalname: file.name,
      encoding: "7bit",
      mimetype: file.type,
      buffer: Buffer.from(buffer),
      size: file.size,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    // Validate file
    const validation = FileUploader.validateFile(multerFile);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload file
    const result = await FileUploader.uploadCourseContent(multerFile, id, lessonId);

    // Return 201 Created to match client expectation
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/courses/[id]/upload
 * Delete uploaded file
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    // Align with client which sends ?fileUrl=
    const fileUrl = searchParams.get("fileUrl");

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }

    // Delete file
    await FileUploader.deleteFile(fileUrl);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
