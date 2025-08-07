import React, { useRef } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUploadResult } from '@/lib/image-upload';
import Image from 'next/image';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  category?: 'blog' | 'avatars' | 'thumbnails';
  onImageUploaded?: (result: ImageUploadResult) => void;
  onImageRemoved?: () => void;
  className?: string;
  maxFileSize?: number;
  showPreview?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
  placeholder?: string;
}

/**
 * Fast image upload component with drag-and-drop and progress tracking
 */
export default function ImageUpload({
  category = 'blog',
  onImageUploaded,
  onImageRemoved,
  className = '',
  maxFileSize = 10 * 1024 * 1024,
  showPreview = true,
  aspectRatio = 'auto',
  placeholder = 'Drop an image here or click to browse'
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isUploading,
    progress,
    error,
    result,
    handleFileChange,
    handleDrop,
    handleDragOver,
    reset,
    deleteImage
  } = useImageUpload({
    category,
    maxFileSize,
    onSuccess: onImageUploaded,
    onError: (error) => console.error('Upload error:', error)
  });

  const handleRemoveImage = async () => {
    if (result?.original) {
      try {
        await deleteImage(result.original);
        onImageRemoved?.();
      } catch (error) {
        console.error('Failed to remove image:', error);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      default:
        return 'aspect-auto';
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
        ${isUploading ? 'pointer-events-none opacity-75' : ''}
        ${className}
      `}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center justify-center h-full text-center">
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600 mb-1">Upload failed</p>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700"
            >
              Try again
            </button>
          </>
        ) : result ? (
          <>
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-sm text-green-600">Upload successful!</p>
            <p className="text-xs text-gray-500">{result.filename}</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-500">
              Supports: JPEG, PNG, WebP, GIF (max {Math.round(maxFileSize / 1024 / 1024)}MB)
            </p>
          </>
        )}
      </div>
    </div>
  );

  const renderPreview = () => {
    if (!result || !showPreview) return null;

    return (
      <div className="relative group">
        <div className={`relative overflow-hidden rounded-lg ${getAspectRatioClass()}`}>
          <Image
            src={result.webp || result.original}
            alt="Uploaded image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay with remove button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Image info */}
        <div className="mt-2 text-xs text-gray-500">
          <p>{result.width} × {result.height}</p>
          <p>{Math.round(result.size / 1024)}KB</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderUploadArea()}
      {renderPreview()}
    </div>
  );
}
