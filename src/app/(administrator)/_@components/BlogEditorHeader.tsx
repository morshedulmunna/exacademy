"use client";

import React, { useState } from "react";
import { Image, Type, MoreVertical, Settings, Copy, Moon, HelpCircle, X } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { ImageUploadResult } from "@/lib/image-upload";

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
}

export default function BlogEditorHeader({ onAddCover, onRemoveCover, coverImage, onAddSubtitle, onPublish, onCopyMarkdown, onToggleDarkMode, onToggleRawEditor, darkMode = true, rawMarkdownEditor = false }: BlogEditorHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

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

  const handleImageUploaded = (result: ImageUploadResult) => {
    onAddCover?.(result);
    setShowImageUpload(false);
  };

  const handleImageRemoved = () => {
    onRemoveCover?.();
  };

  return (
    <div className="p-6 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {coverImage ? (
            <div className="flex items-center space-x-2">
              <div className="relative w-16 h-12 rounded-md overflow-hidden">
                <img src={coverImage.webp || coverImage.original} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <button onClick={handleImageRemoved} className="p-1 text-red-400 hover:text-red-300 transition-colors" title="Remove cover image">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowImageUpload(true)} className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
              <Image className="w-4 h-4" />
              <span className="text-sm">Add Cover</span>
            </button>
          )}
          <button onClick={onAddSubtitle} className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
            <Type className="w-4 h-4" />
            <span className="text-sm">Add Subtitle</span>
          </button>
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

          <button onClick={onPublish} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
