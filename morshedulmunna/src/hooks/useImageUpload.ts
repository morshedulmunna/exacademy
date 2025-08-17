import { useState, useCallback } from "react";
import { ImageUploadResult } from "@/lib/image-upload";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: ImageUploadResult | null;
}

interface UseImageUploadOptions {
  category?: "blog" | "avatars" | "thumbnails";
  maxFileSize?: number;
  allowedTypes?: string[];
  onSuccess?: (result: ImageUploadResult) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook for fast image uploads with progress tracking
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    category = "blog",
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  /**
   * Validate file before upload
   */
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      if (!file) {
        return { valid: false, error: "No file selected" };
      }

      if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" };
      }

      if (file.size > maxFileSize) {
        return { valid: false, error: `File size too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB` };
      }

      return { valid: true };
    },
    [allowedTypes, maxFileSize]
  );

  /**
   * Upload image with progress tracking
   */
  const uploadImage = useCallback(
    async (file: File): Promise<ImageUploadResult> => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setState((prev) => ({
        ...prev,
        isUploading: true,
        progress: 0,
        error: null,
        result: null,
      }));

      try {
        // Create FormData
        const formData = new FormData();
        formData.append("image", file);
        formData.append("category", category);

        // Create XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setState((prev) => ({ ...prev, progress }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  setState((prev) => ({
                    ...prev,
                    isUploading: false,
                    progress: 100,
                    result: response.data,
                  }));
                  onSuccess?.(response.data);
                  resolve(response.data);
                } else {
                  throw new Error(response.error || "Upload failed");
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to parse response";
                setState((prev) => ({
                  ...prev,
                  isUploading: false,
                  error: errorMessage,
                }));
                onError?.(errorMessage);
                reject(new Error(errorMessage));
              }
            } else {
              const errorMessage = `Upload failed with status ${xhr.status}`;
              setState((prev) => ({
                ...prev,
                isUploading: false,
                error: errorMessage,
              }));
              onError?.(errorMessage);
              reject(new Error(errorMessage));
            }
          });

          xhr.addEventListener("error", () => {
            const errorMessage = "Network error occurred";
            setState((prev) => ({
              ...prev,
              isUploading: false,
              error: errorMessage,
            }));
            onError?.(errorMessage);
            reject(new Error(errorMessage));
          });

          // No backend in UI-only build; this will fail unless endpoint exists
          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: errorMessage,
        }));
        onError?.(errorMessage);
        throw error;
      }
    },
    [category, validateFile, onSuccess, onError]
  );

  /**
   * Handle file input change
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          await uploadImage(file);
        } catch (error) {
          // Error is already handled in uploadImage
        }
      }
    },
    [uploadImage]
  );

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        try {
          await uploadImage(file);
        } catch (error) {
          // Error is already handled in uploadImage
        }
      }
    },
    [uploadImage]
  );

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

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
   * Delete uploaded image
   */
  const deleteImage = useCallback(
    async (imagePath: string): Promise<void> => {
      try {
        const response = await fetch(`/api/upload?path=${encodeURIComponent(imagePath)}`, { method: "DELETE" });

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }

        // Reset state after successful deletion
        reset();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete image";
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      }
    },
    [reset]
  );

  return {
    ...state,
    uploadImage,
    handleFileChange,
    handleDrop,
    handleDragOver,
    reset,
    deleteImage,
    validateFile,
  };
}
