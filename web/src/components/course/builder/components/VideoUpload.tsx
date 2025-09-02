"use client";

import React, { useState, useRef } from "react";
import { Upload, Play, Pause, X, CheckCircle, AlertCircle, Video, Trash2 } from "lucide-react";
import { useVideoUpload } from "@/hooks/useVideoUpload";

interface VideoUploadProps {
  lessonId?: string;
  existingVideoUrl?: string;
  onVideoUploaded?: (videoUrl: string) => void;
  onVideoRemoved?: () => void;
  className?: string;
}

export default function VideoUpload({ lessonId, existingVideoUrl, onVideoUploaded, onVideoRemoved, className = "" }: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploader, setShowUploader] = useState(!existingVideoUrl);

  const { uploadState, initializeUpload, pauseUpload, resumeUpload, resetUpload, retryFailedChunks } = useVideoUpload({
    onComplete: (videoUrl) => {
      onVideoUploaded?.(videoUrl);
      setShowUploader(false);
    },
    onError: (error) => {
      console.error("Video upload error:", error);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    initializeUpload(file, lessonId);
  };

  const handleRemoveVideo = () => {
    if (confirm("Are you sure you want to remove this video?")) {
      onVideoRemoved?.();
      setShowUploader(true);
    }
  };

  const handleReset = () => {
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Show existing video if available and uploader is hidden
  if (existingVideoUrl && !showUploader) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Video className="w-5 h-5 text-blue-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Video Attached</h4>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setShowUploader(true)} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Replace
            </button>
            <button onClick={handleRemoveVideo} className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 flex items-center">
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </button>
          </div>
        </div>
        <video src={existingVideoUrl} controls className="w-full max-h-64 rounded-lg bg-black">
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <Upload className="w-5 h-5 text-gray-500 mr-2" />
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Upload Video</h4>
      </div>

      {/* File Selection */}
      {uploadState.status === "idle" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 100MB. Supported: MP4, WebM, AVI, MOV, etc.</p>
        </div>
      )}

      {/* File Info */}
      {uploadState.file && (
        <div className="bg-white dark:bg-gray-600 rounded-lg p-3 mb-3">
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>File:</span>
              <span className="font-medium">{uploadState.file.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span>Chunks:</span>
              <span>{uploadState.chunks.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {(uploadState.status === "initializing" || uploadState.status === "uploading" || uploadState.status === "paused" || uploadState.status === "completed" || uploadState.status === "failed") && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{uploadState.totalProgress.toFixed(1)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadState.totalProgress}%` }} />
          </div>

          {/* Status and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {uploadState.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
              {uploadState.status === "failed" && <AlertCircle className="w-4 h-4 text-red-500 mr-1" />}
              <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">{uploadState.status}</span>
            </div>

            <div className="flex space-x-1">
              {uploadState.status === "uploading" && (
                <button onClick={pauseUpload} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium py-1 px-2 rounded flex items-center">
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </button>
              )}

              {uploadState.status === "paused" && (
                <button onClick={resumeUpload} className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </button>
              )}

              {uploadState.status === "failed" && (
                <button onClick={retryFailedChunks} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded">
                  Retry
                </button>
              )}

              {(uploadState.status === "completed" || uploadState.status === "failed" || uploadState.status === "paused") && (
                <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium py-1 px-2 rounded flex items-center">
                  <X className="w-3 h-3 mr-1" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Chunk Visualization */}
          {uploadState.chunks.length > 0 && uploadState.chunks.length <= 20 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Chunks ({uploadState.chunks.filter((c) => c.status === "completed").length}/{uploadState.chunks.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {uploadState.chunks.map((chunk) => (
                  <div
                    key={chunk.index}
                    className={`w-3 h-3 rounded ${chunk.status === "completed" ? "bg-green-500" : chunk.status === "uploading" ? "bg-blue-500" : chunk.status === "failed" ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    title={`Chunk ${chunk.index + 1}: ${chunk.status}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {uploadState.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-xs font-medium text-red-800 dark:text-red-400">Upload Error</span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">{uploadState.error}</p>
        </div>
      )}

      {/* Cancel/Hide Option */}
      {existingVideoUrl && uploadState.status === "idle" && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <button onClick={() => setShowUploader(false)} className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Cancel and keep existing video
          </button>
        </div>
      )}
    </div>
  );
}
