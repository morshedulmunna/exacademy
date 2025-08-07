"use client";

import React, { useRef, useState } from "react";
import { Upload, X, File, Video, FileText, Image, Music, Archive, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useCourseContentUpload, FileUploadResult } from "@/hooks/useCourseContentUpload";

export interface CourseContentUploadProps {
  courseId: string;
  lessonId?: string;
  onFileUploaded?: (result: FileUploadResult) => void;
  onFileRemoved?: () => void;
  className?: string;
  maxFileSize?: number;
  showPreview?: boolean;
  placeholder?: string;
  acceptedFileTypes?: string[];
}

/**
 * Course content upload component with drag-and-drop and progress tracking
 */
export default function CourseContentUpload({
  courseId,
  lessonId,
  onFileUploaded,
  onFileRemoved,
  className = "",
  maxFileSize = 500 * 1024 * 1024, // 500MB
  showPreview = true,
  placeholder = "Drop course content here or click to browse",
  acceptedFileTypes = ["*"],
}: CourseContentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);

  const { isUploading, progress, error, result, handleFileChange, handleDrop, handleDragOver, reset, deleteFile } = useCourseContentUpload({
    courseId,
    lessonId,
    onSuccess: (result) => {
      setUploadedFiles((prev) => [...prev, result]);
      onFileUploaded?.(result);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleRemoveFile = async (fileUrl: string) => {
    try {
      await deleteFile(fileUrl);
      setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));
      onFileRemoved?.();
    } catch (error) {
      console.error("Failed to remove file:", error);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-5 h-5 text-red-500" />;
      case "PDF":
      case "DOCUMENT":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "IMAGE":
        return <Image className="w-5 h-5 text-green-500" />;
      case "AUDIO":
        return <Music className="w-5 h-5 text-purple-500" />;
      case "OTHER":
        return <Archive className="w-5 h-5 text-gray-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${
            isUploading
              ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
              : error
              ? "border-red-300 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept={acceptedFileTypes.join(",")} />

        <div className="space-y-2">
          <Upload className={`mx-auto h-12 w-12 ${isUploading ? "text-blue-500" : "text-gray-400"}`} />

          <div className="text-sm">
            {isUploading ? (
              <div className="space-y-2">
                <p className="text-blue-600 dark:text-blue-400 font-medium">Uploading...</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-blue-600 dark:text-blue-400">{progress}%</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{placeholder}</p>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">Maximum file size: {formatFileSize(maxFileSize)}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.originalName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <button onClick={() => handleRemoveFile(file.url)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Remove file">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Type Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="font-medium">Supported file types:</p>
        <div className="grid grid-cols-2 gap-1">
          <div className="flex items-center space-x-1">
            <Video className="w-3 h-3 text-red-500" />
            <span>Videos (MP4, AVI, MOV, etc.)</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3 text-blue-500" />
            <span>Documents (PDF, DOC, PPT, etc.)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Image className="w-3 h-3 text-green-500" />
            <span>Images (JPG, PNG, GIF, etc.)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Music className="w-3 h-3 text-purple-500" />
            <span>Audio (MP3, WAV, OGG, etc.)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
