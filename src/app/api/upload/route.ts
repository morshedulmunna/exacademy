import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ImageUploader } from "@/lib/image-upload";
import multer from "multer";
import { promisify } from "util";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Promisify multer
const uploadMiddleware = promisify(upload.single("image"));

/**
 * POST /api/upload
 * Upload image with fast processing and optimization
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const category = (formData.get("category") as string) || "blog";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create mock file object for ImageUploader
    const mockFile: Express.Multer.File = {
      fieldname: "image",
      originalname: file.name,
      encoding: "7bit",
      mimetype: file.type,
      buffer,
      size: file.size,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    // Validate file
    const validation = ImageUploader.validateFile(mockFile);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Process and upload image
    const result = await ImageUploader.uploadImage(mockFile, category as "blog" | "avatars" | "thumbnails", {
      quality: 85,
      maxWidth: 1920,
      maxHeight: 1080,
      thumbnailWidth: 400,
      thumbnailHeight: 300,
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

/**
 * DELETE /api/upload
 * Delete uploaded image and all its variants
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return NextResponse.json({ error: "Image path is required" }, { status: 400 });
    }

    // Delete image and all variants
    await ImageUploader.deleteImage(imagePath);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
