import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export interface ImageUploadResult {
  original: string;
  thumbnail: string;
  webp: string;
  webpThumbnail: string;
  filename: string;
  size: number;
  width: number;
  height: number;
}

export interface ImageUploadOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  format?: "webp" | "jpeg" | "png";
}

/**
 * Fast image upload utility with optimization and multiple format support
 */
export class ImageUploader {
  private static readonly UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
  private static readonly ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Validate uploaded file
   */
  static validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: "No file uploaded" };
    }

    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      return { valid: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: "File size too large. Maximum size is 10MB" };
    }

    return { valid: true };
  }

  /**
   * Generate unique filename with timestamp
   */
  static generateFilename(originalName: string, prefix: string = ""): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const uuid = uuidv4().replace(/-/g, "").substring(0, 8);
    return `${prefix}${timestamp}_${uuid}${ext}`;
  }

  /**
   * Process and optimize image with multiple formats and sizes
   */
  static async processImage(buffer: Buffer, filename: string, category: "blog" | "avatars" | "thumbnails" = "blog", options: ImageUploadOptions = {}): Promise<ImageUploadResult> {
    const { quality = 85, maxWidth = 1920, maxHeight = 1080, thumbnailWidth = 400, thumbnailHeight = 300, format = "webp" } = options;

    const baseDir = path.join(this.UPLOAD_DIR, category);
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.extname(filename);

    // Ensure directory exists
    await fs.mkdir(baseDir, { recursive: true });

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const { width = 0, height = 0 } = metadata;

    // Calculate dimensions maintaining aspect ratio
    const aspectRatio = width / height;
    let finalWidth = width;
    let finalHeight = height;

    if (width > maxWidth || height > maxHeight) {
      if (width > height) {
        finalWidth = maxWidth;
        finalHeight = Math.round(maxWidth / aspectRatio);
      } else {
        finalHeight = maxHeight;
        finalWidth = Math.round(maxHeight * aspectRatio);
      }
    }

    // Calculate thumbnail dimensions
    const thumbnailAspectRatio = thumbnailWidth / thumbnailHeight;
    let thumbWidth = thumbnailWidth;
    let thumbHeight = thumbnailHeight;

    if (aspectRatio > thumbnailAspectRatio) {
      thumbHeight = Math.round(thumbnailWidth / aspectRatio);
    } else {
      thumbWidth = Math.round(thumbnailHeight * aspectRatio);
    }

    // Process images in parallel for maximum performance
    const [originalBuffer, thumbnailBuffer, webpBuffer, webpThumbnailBuffer] = await Promise.all([
      // Original optimized image
      sharp(buffer).resize(finalWidth, finalHeight, { fit: "inside", withoutEnlargement: true }).jpeg({ quality }).toBuffer(),

      // Thumbnail
      sharp(buffer).resize(thumbWidth, thumbHeight, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer(),

      // WebP version
      sharp(buffer).resize(finalWidth, finalHeight, { fit: "inside", withoutEnlargement: true }).webp({ quality }).toBuffer(),

      // WebP thumbnail
      sharp(buffer).resize(thumbWidth, thumbHeight, { fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
    ]);

    // Generate filenames
    const originalFilename = `${nameWithoutExt}.jpg`;
    const thumbnailFilename = `${nameWithoutExt}_thumb.jpg`;
    const webpFilename = `${nameWithoutExt}.webp`;
    const webpThumbnailFilename = `${nameWithoutExt}_thumb.webp`;

    // Save files in parallel
    await Promise.all([
      fs.writeFile(path.join(baseDir, originalFilename), originalBuffer),
      fs.writeFile(path.join(baseDir, thumbnailFilename), thumbnailBuffer),
      fs.writeFile(path.join(baseDir, webpFilename), webpBuffer),
      fs.writeFile(path.join(baseDir, webpThumbnailFilename), webpThumbnailBuffer),
    ]);

    return {
      original: `/uploads/${category}/${originalFilename}`,
      thumbnail: `/uploads/${category}/${thumbnailFilename}`,
      webp: `/uploads/${category}/${webpFilename}`,
      webpThumbnail: `/uploads/${category}/${webpThumbnailFilename}`,
      filename: originalFilename,
      size: originalBuffer.length,
      width: finalWidth,
      height: finalHeight,
    };
  }

  /**
   * Upload image with category-specific processing
   */
  static async uploadImage(file: Express.Multer.File, category: "blog" | "avatars" | "thumbnails" = "blog", options?: ImageUploadOptions): Promise<ImageUploadResult> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique filename
    const filename = this.generateFilename(file.originalname, `${category}_`);

    // Process image
    return await this.processImage(file.buffer, filename, category, options);
  }

  /**
   * Delete image and all its variants
   */
  static async deleteImage(imagePath: string): Promise<void> {
    try {
      const baseDir = path.join(process.cwd(), "public");
      const fullPath = path.join(baseDir, imagePath);
      const dir = path.dirname(fullPath);
      const nameWithoutExt = path.parse(fullPath).name;

      // Get all variants
      const variants = [`${nameWithoutExt}.jpg`, `${nameWithoutExt}_thumb.jpg`, `${nameWithoutExt}.webp`, `${nameWithoutExt}_thumb.webp`];

      // Delete all variants
      await Promise.all(
        variants.map(async (variant) => {
          const variantPath = path.join(dir, variant);
          try {
            await fs.unlink(variantPath);
          } catch (error) {
            // File might not exist, ignore error
          }
        })
      );
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Failed to delete image");
    }
  }

  /**
   * Get optimized image URL based on format preference
   */
  static getOptimizedUrl(imagePath: string, preferWebP: boolean = true): string {
    if (!imagePath) return "";

    const ext = path.extname(imagePath);
    if (preferWebP && ext !== ".webp") {
      return imagePath.replace(/\.[^.]+$/, ".webp");
    }

    return imagePath;
  }

  /**
   * Get thumbnail URL
   */
  static getThumbnailUrl(imagePath: string, preferWebP: boolean = true): string {
    if (!imagePath) return "";

    const ext = path.extname(imagePath);
    const basePath = imagePath.replace(/\.[^.]+$/, "");

    if (preferWebP) {
      return `${basePath}_thumb.webp`;
    }

    return `${basePath}_thumb.jpg`;
  }
}
