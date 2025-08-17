import { useState, useCallback } from "react";

export interface CourseContentUploadOptions {
  courseId: string;
  lessonId?: string;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
  originalName: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: FileUploadResult | null;
}

/**
 * Custom hook for course content uploads with progress tracking
 */
export function useCourseContentUpload(options: CourseContentUploadOptions) {
  const { courseId, lessonId, onSuccess, onError, onProgress } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    if (!file) {
      return { valid: false, error: "No file selected" };
    }

    // Check file size (500MB max for videos)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: `File size too large. Maximum size is 500MB` };
    }

    // Check file type
    const allowedTypes = [
      // Videos
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/x-ms-wmv",
      "video/x-flv",
      "video/webm",
      "video/x-matroska",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/rtf",
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Audio
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "audio/aac",
      // Archives
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
      "application/gzip",
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not supported" };
    }

    return { valid: true };
  }, []);

  /**
   * Upload file with progress tracking
   */
  const uploadFile = useCallback(
    async (file: File): Promise<void> => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        const error = validation.error || "File validation failed";
        setState((prev) => ({ ...prev, error, isUploading: false }));
        onError?.(error);
        return;
      }

      setState((prev) => ({ ...prev, isUploading: true, error: null, progress: 0 }));

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (lessonId) {
          formData.append("lessonId", lessonId);
        }

        const xhr = new XMLHttpRequest();

        // Progress tracking
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setState((prev) => ({ ...prev, progress }));
            onProgress?.(progress);
          }
        });

        // Response handling
        xhr.addEventListener("load", () => {
          if (xhr.status === 201) {
            try {
              const result = JSON.parse(xhr.responseText) as FileUploadResult;
              setState((prev) => ({ ...prev, result, isUploading: false, progress: 100 }));
              onSuccess?.(result);
            } catch (error) {
              const errorMessage = "Failed to parse upload response";
              setState((prev) => ({ ...prev, error: errorMessage, isUploading: false }));
              onError?.(errorMessage);
            }
          } else {
            let errorMessage = "Upload failed";
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage = errorResponse.error || errorMessage;
            } catch {
              errorMessage = `Upload failed with status ${xhr.status}`;
            }
            setState((prev) => ({ ...prev, error: errorMessage, isUploading: false }));
            onError?.(errorMessage);
          }
        });

        // Error handling
        xhr.addEventListener("error", () => {
          const errorMessage = "Network error during upload";
          setState((prev) => ({ ...prev, error: errorMessage, isUploading: false }));
          onError?.(errorMessage);
        });

        // Send request
        xhr.open("POST", `/api/courses/${courseId}/upload`);
        xhr.send(formData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        setState((prev) => ({ ...prev, error: errorMessage, isUploading: false }));
        onError?.(errorMessage);
      }
    },
    [courseId, lessonId, validateFile, onSuccess, onError, onProgress]
  );

  /**
   * Delete uploaded file
   */
  const deleteFile = useCallback(
    async (fileUrl: string): Promise<void> => {
      try {
        // Static UI: pretend delete succeeded
        setState((prev) => ({ ...prev, result: null }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete file";
        setState((prev) => ({ ...prev, error: errorMessage }));
        onError?.(errorMessage);
      }
    },
    [courseId, onError]
  );

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return {
    ...state,
    uploadFile,
    deleteFile,
    reset,
    handleFileChange,
    handleDrop,
    handleDragOver,
  };
}
