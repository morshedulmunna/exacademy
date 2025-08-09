"use client";

import React, { useEffect, useRef, useState } from "react";
import { Image, Type, MoreVertical, Settings, Copy, Moon, HelpCircle, X, ArrowLeft, ArrowUpDown } from "lucide-react";
import { ImageUploadResult } from "@/lib/image-upload";
import { useImageUpload } from "@/hooks/useImageUpload";

import { AddCoverHandler, AddSubtitleHandler, PublishHandler, CopyMarkdownHandler, ToggleDarkModeHandler, ToggleRawEditorHandler } from "./types";

interface BlogEditorHeaderProps {
  onAddCover?: (imageResult: ImageUploadResult) => void;
  onRemoveCover?: () => void;
  coverImage?: ImageUploadResult | null;
  onAddSubtitle?: AddSubtitleHandler;
  onPublish?: PublishHandler;
  onCopyMarkdown?: CopyMarkdownHandler;
  onToggleDarkMode?: ToggleDarkModeHandler;
  onToggleRawEditor?: ToggleRawEditorHandler;
  darkMode?: boolean;
  rawMarkdownEditor?: boolean;
  publishDisabled?: boolean;
}

export default function BlogEditorHeader({ onAddCover, onRemoveCover, coverImage, onAddSubtitle, onPublish, onCopyMarkdown, onToggleDarkMode, onToggleRawEditor, darkMode = true, rawMarkdownEditor = false, publishDisabled = false }: BlogEditorHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [alignLeft, setAlignLeft] = useState(false);
  const [tall, setTall] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleFileChange, isUploading, progress } = useImageUpload({
    category: "blog",
    onSuccess: (result) => {
      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
      onAddCover?.(result);
    },
    onError: () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    },
  });

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleCopyMarkdown = () => {
    onCopyMarkdown?.();
    setShowDropdown(false);
  };

  const handleToggleDarkMode = () => {
    onToggleDarkMode?.(!darkMode);
  };

  const handleToggleRawEditor = () => {
    onToggleRawEditor?.(!rawMarkdownEditor);
  };

  const handleImageRemoved = () => {
    onRemoveCover?.();
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 border-b border-gray-700 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 sticky top-16 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!coverImage && (
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                <Image className="w-4 h-4" />
                <span className="text-sm">Add Cover</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Dropdown Menu */}
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Article Settings</span>
                    </button>

                    <button onClick={handleCopyMarkdown} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                      <Copy className="w-4 h-4" />
                      <span>Copy markdown</span>
                    </button>

                    <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-300">
                      <div className="flex items-center space-x-3">
                        <Moon className="w-4 h-4" />
                        <span>Dark mode</span>
                      </div>
                      <button onClick={handleToggleDarkMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? "bg-green-600" : "bg-gray-600"}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-300">
                      <div className="flex items-center space-x-3">
                        <span className="w-4 h-4 text-center text-xs font-mono">M↓</span>
                        <span>Raw markdown editor</span>
                      </div>
                      <button onClick={handleToggleRawEditor} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rawMarkdownEditor ? "bg-green-600" : "bg-gray-600"}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rawMarkdownEditor ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </div>

                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span>Editor - FAQs & help</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={onPublish} disabled={publishDisabled} className={`px-6 py-2 rounded-md font-medium gradient-bg transition-colors text-white ${publishDisabled ? "bg-blue-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
              Publish
            </button>
          </div>
        </div>
      </div>
      {/* Large cover preview */}
      {(coverImage || localPreview) && (
        <div className="px-4 sm:px-6 pt-4">
          <div className={`relative w-full ${tall ? "h-80 md:h-96" : "h-64 md:h-72"} rounded-xl overflow-hidden  bg-gray-800`}>
            <img src={localPreview || coverImage?.webp || coverImage?.original || ""} alt="Cover" className={`w-full h-full object-cover ${alignLeft ? "object-left" : "object-center"}`} />
            {isUploading && (
              <div className="absolute inset-0 bg-black/30 grid place-items-center">
                <div className="text-xs rounded-full bg-white/90 text-gray-800 px-3 py-1">Uploading… {progress}%</div>
              </div>
            )}
            {/* Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button onClick={() => setAlignLeft((v) => !v)} className="h-8 w-8 rounded-md bg-white/90 text-gray-800 hover:bg-white shadow border border-black/10 grid place-items-center" title={alignLeft ? "Center image" : "Align left"}>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setTall((v) => !v)} className="h-8 w-8 rounded-md bg-white/90 text-gray-800 hover:bg-white shadow border border-black/10 grid place-items-center" title={tall ? "Reduce height" : "Increase height"}>
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button onClick={handleImageRemoved} className="h-8 w-8 rounded-md bg-white/90 text-gray-800 hover:bg-white shadow border border-black/10 grid place-items-center" title="Remove">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for direct selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          if (localPreview) URL.revokeObjectURL(localPreview);
          setLocalPreview(url);
          await handleFileChange(e);
        }}
      />
    </>
  );
}
