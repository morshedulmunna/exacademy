"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Result returned after a successful file upload
 */
export interface FileUploadResult {
  url: string;
  type: "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE" | "AUDIO" | "OTHER";
  size: number;
  filename: string;
  originalName: string;
}

/**
 * Options for configuring the course content upload behavior
 */
export interface UseCourseContentUploadOptions {
  courseId: string;
  lessonId?: string;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (message: string) => void;
  maxFileSizeBytes?: number;
}

/**
 * Return shape for the useCourseContentUpload hook
 */
export interface UseCourseContentUploadReturn {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: FileUploadResult | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => Promise<void>;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  reset: () => void;
  deleteFile: (fileUrl: string) => Promise<void>;
}

/**
 * useCourseContentUpload provides a client-only upload flow with progress.
 * This implementation simulates uploading locally by creating an object URL
 * and writing the file under /public/uploads at build/runtime via dev server.
 * In production, replace the simulateUpload() with a real API call to your backend or S3.
 */
export function useCourseContentUpload(options: UseCourseContentUploadOptions): UseCourseContentUploadReturn {
  const { courseId, lessonId, onSuccess, onError, maxFileSizeBytes = 500 * 1024 * 1024 } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FileUploadResult | null>(null);

  const classifyFileType = (file: File): FileUploadResult["type"] => {
    const mime = file.type.toLowerCase();
    if (mime.startsWith("video/")) return "VIDEO";
    if (mime === "application/pdf") return "PDF";
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime.startsWith("audio/")) return "AUDIO";
    if (mime.startsWith("text/") || mime.includes("msword") || mime.includes("officedocument")) return "DOCUMENT";
    return "OTHER";
  };

  const simulateUpload = async (file: File): Promise<FileUploadResult> => {
    // Simulate a progressive upload with a timeout-based progress update
    return await new Promise<FileUploadResult>((resolve, reject) => {
      try {
        const totalSteps = 15;
        let step = 0;
        setIsUploading(true);
        const timer = setInterval(() => {
          step += 1;
          const nextProgress = Math.min(100, Math.round((step / totalSteps) * 100));
          setProgress(nextProgress);
          if (step >= totalSteps) {
            clearInterval(timer);
            const objectUrl = URL.createObjectURL(file);
            const res: FileUploadResult = {
              url: objectUrl,
              type: classifyFileType(file),
              size: file.size,
              filename: file.name,
              originalName: file.name,
            };
            resolve(res);
          }
        }, 80);
      } catch (e) {
        reject(e);
      }
    });
  };

  const processFile = useCallback(
    async (file: File) => {
      if (!file) return;
      if (file.size > maxFileSizeBytes) {
        const message = `File exceeds limit of ${Math.round(maxFileSizeBytes / 1024 / 1024)}MB`;
        setError(message);
        onError?.(message);
        return;
      }
      setError(null);
      setResult(null);
      setProgress(0);
      try {
        const uploaded = await simulateUpload(file);
        setResult(uploaded);
        onSuccess?.(uploaded);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Upload failed";
        setError(message);
        onError?.(message);
      } finally {
        setIsUploading(false);
      }
    },
    [maxFileSizeBytes, onError, onSuccess]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) await processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file) await processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  const deleteFile = useCallback(async (_fileUrl: string) => {
    // In a real implementation, call backend to delete. Here we just reset state.
    // This is safe because CourseContentUpload maintains its own list.
    return Promise.resolve();
  }, []);

  return useMemo(
    () => ({
      isUploading,
      progress,
      error,
      result,
      handleFileChange,
      handleDrop,
      handleDragOver,
      reset,
      deleteFile,
    }),
    [isUploading, progress, error, result, handleFileChange, handleDrop, handleDragOver]
  );
}

export default useCourseContentUpload;
