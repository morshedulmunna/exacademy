import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

/**
 * File upload utility for course content
 * Supports videos, documents, PDFs, images, and other file types
 */
type FileTypeConfig = {
  extensions: string[];
  mimeTypes: string[];
  maxSize: number;
  category: string;
};

export class FileUploader {
  private static readonly UPLOAD_DIR = path.join(process.cwd(), 'src', 'public', 'uploads');
  private static readonly COURSE_CONTENT_DIR = path.join(process.cwd(), 'src', 'public', 'uploads', 'course-content');
  
  // File type configurations
  private static readonly FILE_TYPES: Record<
    'VIDEO' | 'PDF' | 'DOCUMENT' | 'IMAGE' | 'AUDIO' | 'OTHER',
    FileTypeConfig
  > = {
    VIDEO: {
      extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'],
      mimeTypes: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/x-matroska'],
      maxSize: 500 * 1024 * 1024, // 500MB
      category: 'videos'
    },
    PDF: {
      extensions: ['.pdf'],
      mimeTypes: ['application/pdf'],
      maxSize: 50 * 1024 * 1024, // 50MB
      category: 'documents'
    },
    DOCUMENT: {
      extensions: ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.rtf'],
      mimeTypes: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/rtf'
      ],
      maxSize: 20 * 1024 * 1024, // 20MB
      category: 'documents'
    },
    IMAGE: {
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      maxSize: 10 * 1024 * 1024, // 10MB
      category: 'images'
    },
    AUDIO: {
      extensions: ['.mp3', '.wav', '.ogg', '.m4a', '.aac'],
      mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac'],
      maxSize: 100 * 1024 * 1024, // 100MB
      category: 'audio'
    },
    OTHER: {
      extensions: ['.zip', '.rar', '.7z', '.tar', '.gz'],
      mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip'],
      maxSize: 100 * 1024 * 1024, // 100MB
      category: 'archives'
    }
  };

  /**
   * Get file type configuration based on file extension or MIME type
   */
  static getFileType(file: Express.Multer.File): keyof typeof FileUploader.FILE_TYPES {
    const extension = path.extname(file.originalname).toLowerCase();
    
    for (const [type, config] of Object.entries(this.FILE_TYPES)) {
      if (config.extensions.includes(extension) || config.mimeTypes.includes(file.mimetype)) {
        return type as keyof typeof FileUploader.FILE_TYPES;
      }
    }
    
    return 'OTHER';
  }

  /**
   * Validate uploaded file
   */
  static validateFile(file: Express.Multer.File): { valid: boolean; error?: string; fileType?: keyof typeof FileUploader.FILE_TYPES } {
    if (!file) {
      return { valid: false, error: 'No file uploaded' };
    }

    const fileType = this.getFileType(file);
    const config = this.FILE_TYPES[fileType];

    if (file.size > config.maxSize) {
      return { 
        valid: false, 
        error: `File size too large. Maximum size is ${Math.round(config.maxSize / 1024 / 1024)}MB` 
      };
    }

    return { valid: true, fileType };
  }

  /**
   * Generate unique filename
   */
  static generateFilename(originalname: string, prefix: string = ''): string {
    const extension = path.extname(originalname);
    const nameWithoutExt = path.basename(originalname, extension);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueId = uuidv4().replace(/-/g, '').substring(0, 8);
    return `${prefix}${sanitizedName}_${uniqueId}${extension}`;
  }

  /**
   * Ensure upload directories exist
   */
  static async ensureDirectories(): Promise<void> {
    const dirs = [
      this.UPLOAD_DIR,
      this.COURSE_CONTENT_DIR,
      path.join(this.COURSE_CONTENT_DIR, 'videos'),
      path.join(this.COURSE_CONTENT_DIR, 'documents'),
      path.join(this.COURSE_CONTENT_DIR, 'images'),
      path.join(this.COURSE_CONTENT_DIR, 'audio'),
      path.join(this.COURSE_CONTENT_DIR, 'archives')
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  /**
   * Upload course content file
   */
  static async uploadCourseContent(
    file: Express.Multer.File,
    courseId: string,
    lessonId?: string
  ): Promise<{
    url: string;
    filename: string;
    size: number;
    type: string;
    originalName: string;
  }> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Ensure directories exist
    await this.ensureDirectories();

    const fileType = validation.fileType!;
    const config = this.FILE_TYPES[fileType];
    
    // Generate filename with course context
    const prefix = lessonId ? `course_${courseId}_lesson_${lessonId}_` : `course_${courseId}_`;
    const filename = this.generateFilename(file.originalname, prefix);
    
    // Determine upload path
    const uploadPath = path.join(this.COURSE_CONTENT_DIR, config.category, filename);
    
    // Save file
    await fs.writeFile(uploadPath, file.buffer);
    
    // Return file info
    return {
      url: `/uploads/course-content/${config.category}/${filename}`,
      filename,
      size: file.size,
      type: fileType,
      originalName: file.originalname
    };
  }

  /**
   * Delete uploaded file
   */
  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), 'src', 'public', fileUrl);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error if file doesn't exist
    }
  }

  /**
   * Get file info from URL
   */
  static getFileInfo(fileUrl: string): {
    category: string;
    filename: string;
    fullPath: string;
  } | null {
    try {
      const urlParts = fileUrl.split('/');
      const category = urlParts[urlParts.length - 2];
      const filename = urlParts[urlParts.length - 1];
      const fullPath = path.join(this.COURSE_CONTENT_DIR, category, filename);
      
      return { category, filename, fullPath };
    } catch {
      return null;
    }
  }
}

export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
  originalName: string;
}
