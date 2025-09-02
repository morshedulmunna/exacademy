import { useState, useCallback } from "react";
import { initVideoUploadAction, completeVideoUploadAction } from "@/actions/video";

interface ChunkUploadStatus {
  index: number;
  status: "pending" | "uploading" | "completed" | "failed";
  progress: number;
  etag?: string;
  retryCount: number;
}

interface VideoUploadState {
  file: File | null;
  uploadId: string | null;
  fileKey: string | null;
  chunks: ChunkUploadStatus[];
  totalProgress: number;
  status: "idle" | "initializing" | "uploading" | "paused" | "completed" | "failed";
  error: string | null;
  chunkUrls: string[];
}

interface UseVideoUploadOptions {
  chunkSize?: number;
  maxRetries?: number;
  onProgress?: (progress: number) => void;
  onComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_RETRIES = 3;

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
  const { chunkSize = DEFAULT_CHUNK_SIZE, maxRetries = DEFAULT_MAX_RETRIES, onProgress, onComplete, onError } = options;

  const [uploadState, setUploadState] = useState<VideoUploadState>({
    file: null,
    uploadId: null,
    fileKey: null,
    chunks: [],
    totalProgress: 0,
    status: "idle",
    error: null,
    chunkUrls: [],
  });

  const initializeUpload = useCallback(
    async (file: File, lessonId?: string): Promise<void> => {
      // Validate file
      if (!file.type.startsWith("video/")) {
        const error = "Please select a video file";
        setUploadState((prev) => ({ ...prev, error, status: "failed" }));
        onError?.(error);
        return;
      }

      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        const error = "File size must be less than 100MB";
        setUploadState((prev) => ({ ...prev, error, status: "failed" }));
        onError?.(error);
        return;
      }

      const totalChunks = Math.ceil(file.size / chunkSize);
      const chunks: ChunkUploadStatus[] = Array.from({ length: totalChunks }, (_, index) => ({
        index,
        status: "pending",
        progress: 0,
        retryCount: 0,
      }));

      setUploadState({
        file,
        uploadId: null,
        fileKey: null,
        chunks,
        totalProgress: 0,
        status: "initializing",
        error: null,
        chunkUrls: [],
      });

      try {
        const response = await initVideoUploadAction({
          filename: file.name,
          content_type: file.type,
          file_size: file.size,
          lesson_id: lessonId || undefined,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to initialize upload");
        }

        const { upload_id, file_key, chunk_urls } = response.data;

        setUploadState((prev) => ({
          ...prev,
          uploadId: upload_id,
          fileKey: file_key,
          chunkUrls: chunk_urls,
          status: "uploading",
        }));

        // Start uploading chunks
        await uploadChunks(file, upload_id, file_key, chunk_urls);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to initialize upload:", error);
        setUploadState((prev) => ({
          ...prev,
          status: "failed",
          error: errorMessage,
        }));
        onError?.(errorMessage);
      }
    },
    [chunkSize, onError]
  );

  const uploadChunks = useCallback(async (file: File, uploadId: string, fileKey: string, chunkUrls: string[]): Promise<void> => {
    // Upload chunks sequentially to maintain order
    const etags: string[] = [];

    for (let i = 0; i < chunkUrls.length; i++) {
      try {
        const etag = await uploadChunk(file, i, chunkUrls[i], uploadId, fileKey);
        if (etag) {
          etags.push(etag);
        }
      } catch (error) {
        console.error(`Failed to upload chunk ${i}:`, error);
        throw error;
      }
    }

    try {
      await completeUpload(uploadId, fileKey, etags);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to complete upload:", error);
      setUploadState((prev) => ({
        ...prev,
        status: "failed",
        error: errorMessage,
      }));
      onError?.(errorMessage);
    }
  }, []);

  const uploadChunk = useCallback(
    async (file: File, chunkIndex: number, presignedUrl: string, uploadId: string, fileKey: string, retryCount = 0): Promise<string | null> => {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // Update chunk status to uploading
      setUploadState((prev) => ({
        ...prev,
        chunks: prev.chunks.map((c) => (c.index === chunkIndex ? { ...c, status: "uploading" } : c)),
      }));

      try {
        const response = await fetch(presignedUrl, {
          method: "PUT",
          body: chunk,
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        if (!response.ok) {
          throw new Error(`Chunk ${chunkIndex} upload failed: ${response.statusText}`);
        }

        // Debug: Log all response headers FIRST (before consuming the body)
        console.log(`Chunk ${chunkIndex} response:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Array.from(response.headers.entries()),
        });

        // Also log the raw response object to see if there are hidden properties
        console.log(`Chunk ${chunkIndex} raw response:`, response);
        console.log(`Chunk ${chunkIndex} response.headers:`, response.headers);
        console.log(`Chunk ${chunkIndex} response.headers.get('ETag'):`, response.headers.get("ETag"));
        console.log(`Chunk ${chunkIndex} response.headers.get('etag'):`, response.headers.get("etag"));
        console.log(`Chunk ${chunkIndex} response.headers.get('Etag'):`, response.headers.get("Etag"));

        // Check if there's a response body that might contain the ETag
        let responseText = "";
        try {
          responseText = await response.text();
          console.log(`Chunk ${chunkIndex} response body:`, responseText);
        } catch (e) {
          console.log(`Chunk ${chunkIndex} no response body or already consumed`);
        }

        // Try different variations of ETag header (case-insensitive)
        let etag = response.headers.get("ETag") || response.headers.get("etag") || response.headers.get("Etag");

        // If still no ETag, check if this is a successful upload
        if (!etag) {
          if (response.ok) {
            // DigitalOcean Spaces doesn't return ETags in some cases
            // We'll use a fallback approach for tracking successful uploads
            console.warn(`No ETag received for chunk ${chunkIndex} from DigitalOcean Spaces`);

            // Generate a unique identifier for this chunk
            // This is not ideal but allows us to track successful uploads
            etag = `chunk-${chunkIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log(`Generated fallback ETag for chunk ${chunkIndex}:`, etag);
          } else {
            throw new Error(`Chunk ${chunkIndex} upload failed: ${response.statusText}`);
          }
        } else {
          // Clean up the ETag (remove quotes if present)
          etag = etag.replace(/"/g, "");
          console.log(`Chunk ${chunkIndex} ETag:`, etag);
        }

        // Update chunk status to completed
        setUploadState((prev) => {
          const newChunks = prev.chunks.map((c) => (c.index === chunkIndex ? { ...c, status: "completed" as const, progress: 100, etag } : c));

          const completedChunks = newChunks.filter((c) => c.status === "completed").length;
          const totalProgress = (completedChunks / newChunks.length) * 100;

          // Call progress callback
          onProgress?.(totalProgress);

          return {
            ...prev,
            chunks: newChunks,
            totalProgress,
          };
        });

        return etag;
      } catch (error) {
        console.error(`Failed to upload chunk ${chunkIndex}:`, error);

        if (retryCount < maxRetries) {
          console.log(`Retrying chunk ${chunkIndex} (attempt ${retryCount + 1})`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return uploadChunk(file, chunkIndex, presignedUrl, uploadId, fileKey, retryCount + 1);
        }

        // Update chunk status to failed
        setUploadState((prev) => ({
          ...prev,
          chunks: prev.chunks.map((c) => (c.index === chunkIndex ? { ...c, status: "failed", retryCount: retryCount + 1 } : c)),
        }));

        throw error;
      }
    },
    [chunkSize, maxRetries, onProgress]
  );

  const completeUpload = useCallback(
    async (uploadId: string, fileKey: string, etags: string[]): Promise<void> => {
      try {
        const response = await completeVideoUploadAction({
          upload_id: uploadId,
          file_key: fileKey,
          chunk_etags: etags,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to complete upload");
        }

        const videoUrl = response.data.video_url;

        setUploadState((prev) => ({
          ...prev,
          status: "completed",
          totalProgress: 100,
        }));

        onComplete?.(videoUrl);
      } catch (error) {
        console.error("Failed to complete upload:", error);
        throw error;
      }
    },
    [onComplete]
  );

  const pauseUpload = useCallback(() => {
    setUploadState((prev) => ({ ...prev, status: "paused" }));
  }, []);

  const resumeUpload = useCallback(() => {
    if (uploadState.uploadId && uploadState.fileKey && uploadState.chunkUrls.length > 0 && uploadState.file) {
      setUploadState((prev) => ({ ...prev, status: "uploading" }));
      uploadChunks(uploadState.file, uploadState.uploadId!, uploadState.fileKey!, uploadState.chunkUrls);
    }
  }, [uploadState.uploadId, uploadState.fileKey, uploadState.chunkUrls, uploadState.file, uploadChunks]);

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      uploadId: null,
      fileKey: null,
      chunks: [],
      totalProgress: 0,
      status: "idle",
      error: null,
      chunkUrls: [],
    });
  }, []);

  const retryFailedChunks = useCallback(async () => {
    if (!uploadState.file || !uploadState.uploadId || !uploadState.fileKey) return;

    const failedChunks = uploadState.chunks.filter((c) => c.status === "failed");
    if (failedChunks.length === 0) return;

    setUploadState((prev) => ({ ...prev, status: "uploading", error: null }));

    try {
      const retryPromises = failedChunks.map((chunk) =>
        uploadChunk(
          uploadState.file!,
          chunk.index,
          uploadState.chunkUrls[chunk.index],
          uploadState.uploadId!,
          uploadState.fileKey!,
          0 // Reset retry count
        )
      );

      await Promise.all(retryPromises);

      // Check if all chunks are now completed
      const allCompleted = uploadState.chunks.every((c) => c.status === "completed" || failedChunks.some((fc) => fc.index === c.index));

      if (allCompleted) {
        const etags = uploadState.chunks
          .filter((c) => c.etag)
          .map((c) => c.etag!)
          .filter(Boolean);

        await completeUpload(uploadState.uploadId!, uploadState.fileKey!, etags);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setUploadState((prev) => ({ ...prev, status: "failed", error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [uploadState, uploadChunk, completeUpload, onError]);

  return {
    uploadState,
    initializeUpload,
    pauseUpload,
    resumeUpload,
    resetUpload,
    retryFailedChunks,
  };
}
