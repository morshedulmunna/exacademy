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

// Frontend-safe stubs to keep UI types working in a design-only build
export const ImageUploader = {
  getOptimizedUrl(imagePath: string, _preferWebP: boolean = true): string {
    return imagePath || "";
  },
  getThumbnailUrl(imagePath: string, _preferWebP: boolean = true): string {
    return imagePath || "";
  },
};
