"use client";

import React, { useState } from "react";
import { Image, Type, MoreVertical, Settings, Copy, Moon, HelpCircle, X, ArrowLeft, ArrowUpDown } from "lucide-react";

import { AddCoverHandler, AddSubtitleHandler, PublishHandler, CopyMarkdownHandler, ToggleDarkModeHandler, ToggleRawEditorHandler } from "./types";

type CoverImageLike = string | { webp?: string; original?: string } | null;

interface BlogEditorHeaderProps {
  onAddCover?: AddCoverHandler;
  onRemoveCover?: () => void;
  coverImage?: CoverImageLike;
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
  };

  return (
    <>
      <div className="p-4 sm:p-6 border-b border-gray-700 bg-gray-900/20 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 sticky top-16 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!coverImage && (
              <button onClick={() => onAddCover?.()} className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
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
      {coverImage && (
        <div className="px-4 sm:px-6 pt-4">
          <div className={`relative w-full ${tall ? "h-80 md:h-96" : "h-64 md:h-72"} rounded-xl overflow-hidden  bg-gray-800`}>
            <img src={typeof coverImage === "string" ? coverImage : coverImage?.webp || coverImage?.original || ""} alt="Cover" className={`w-full h-full object-cover ${alignLeft ? "object-left" : "object-center"}`} />
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
    </>
  );
}
