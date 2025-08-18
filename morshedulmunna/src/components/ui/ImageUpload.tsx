import React, { useRef, useState, useEffect } from "react";
import { Upload, X, CheckCircle } from "lucide-react";

interface ImageUploadProps {
  category?: "blog" | "avatars" | "thumbnails";
  onImageUploaded?: (result: any) => void;
  onImageRemoved?: () => void;
  className?: string;
  maxFileSize?: number;
  showPreview?: boolean;
  aspectRatio?: "square" | "video" | "auto";
  placeholder?: string;
}

/**
 * Fast image upload component with drag-and-drop and progress tracking
 */
export default function ImageUpload({ category = "blog", onImageUploaded, onImageRemoved, className = "", maxFileSize = 10 * 1024 * 1024, showPreview = true, aspectRatio = "auto", placeholder = "Drop an image here or click to browse" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ filename: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // NOTE: This component is a lightweight client-side file picker with preview.
  // Uploading to a server should be handled by the parent via onImageUploaded.

  // Revoke object URL on unmount or when replaced
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleRemoveImage = async () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileMeta(null);
    setError(null);
    onImageRemoved?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxFileSize) {
        setError(`File exceeds limit of ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        return;
      }
      const url = URL.createObjectURL(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setFileMeta({ filename: file.name, size: file.size });
      setError(null);
      onImageUploaded?.({ original: url, webp: url, filename: file.name, size: file.size });
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > maxFileSize) {
        setError(`File exceeds limit of ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        return;
      }
      const url = URL.createObjectURL(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setFileMeta({ filename: file.name, size: file.size });
      setError(null);
      onImageUploaded?.({ original: url, webp: url, filename: file.name, size: file.size });
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      default:
        return "aspect-auto";
    }
  };

  const renderUploadArea = () => (
    <div
      className={`
        relative border-2 border-dashed border-gray-300 rounded-lg p-6
        transition-all duration-200 ease-in-out cursor-pointer
        hover:border-blue-400 hover:bg-blue-50/50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${getAspectRatioClass()}
        ${className}
      `}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
    >
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />

      {/* Live preview (selected file or uploaded result) */}
      {showPreview && previewUrl && (
        <div className={`absolute inset-0 overflow-hidden rounded-lg ${getAspectRatioClass()}`}>
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          {/* Overlay with remove button */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {error ? (
          <>
            <p className="text-sm text-red-600 mb-1">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700"
            >
              Dismiss
            </button>
          </>
        ) : previewUrl ? (
          <>
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-sm text-green-600">Ready to upload...</p>
            {fileMeta && <p className="text-xs text-gray-500">{fileMeta.filename}</p>}
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-500">Supports: JPEG, PNG, WebP, GIF (max {Math.round(maxFileSize / 1024 / 1024)}MB)</p>
          </>
        )}
      </div>
    </div>
  );

  return <div className="space-y-4">{renderUploadArea()}</div>;
}
