import { useState, useCallback } from "react";

export interface FileUploadResult {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface UseCourseContentUploadProps {
  courseId: string;
  lessonId?: string;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: Error) => void;
}

interface UseCourseContentUploadReturn {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: FileUploadResult | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  reset: () => void;
  deleteFile: (fileUrl: string) => Promise<void>;
}

/**
 * Custom hook for managing course content uploads
 */
export function useCourseContentUpload({ courseId, lessonId, onSuccess, onError }: UseCourseContentUploadProps): UseCourseContentUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FileUploadResult | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  const simulateUpload = useCallback(async (file: File): Promise<FileUploadResult> => {
    return new Promise((resolve, reject) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 20;
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(interval);
          const uploadResult: FileUploadResult = {
            id: `file_${Date.now()}`,
            url: URL.createObjectURL(file),
            filename: file.name,
            originalName: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          };
          resolve(uploadResult);
        }
      }, 200);
    });
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const uploadResult = await simulateUpload(file);
        setResult(uploadResult);
        onSuccess?.(uploadResult);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error.message);
        onError?.(error);
      } finally {
        setIsUploading(false);
      }
    },
    [simulateUpload, onSuccess, onError]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const uploadResult = await simulateUpload(file);
        setResult(uploadResult);
        onSuccess?.(uploadResult);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error.message);
        onError?.(error);
      } finally {
        setIsUploading(false);
      }
    },
    [simulateUpload, onSuccess, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const deleteFile = useCallback(async (fileUrl: string) => {
    // Simulate file deletion
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("File deleted:", fileUrl);
  }, []);

  return {
    isUploading,
    progress,
    error,
    result,
    handleFileChange,
    handleDrop,
    handleDragOver,
    reset,
    deleteFile,
  };
}
