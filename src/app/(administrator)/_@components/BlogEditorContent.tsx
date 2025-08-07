"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, Pencil } from "lucide-react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

import { TabChangeHandler, TitleChangeHandler, ContentChangeHandler } from "./types";

interface BlogEditorContentProps {
  activeTab: "write" | "preview";
  articleTitle: string;
  content: string;
  onTabChange: TabChangeHandler;
  onTitleChange: TitleChangeHandler;
  onContentChange: ContentChangeHandler;
}

export default function BlogEditorContent({ activeTab, articleTitle, content, onTabChange, onTitleChange, onContentChange }: BlogEditorContentProps) {
  const [isMarkdownReady, setIsMarkdownReady] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ensure markdown renderer is ready when switching to preview
  useEffect(() => {
    if (activeTab === "preview") {
      setIsMarkdownReady(true);
    }
  }, [activeTab]);

  // Focus textarea when switching to write mode
  useEffect(() => {
    if (activeTab === "write" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeTab]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to switch to preview
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onTabChange("preview");
    }
    // Ctrl/Cmd + 1 to switch to write
    if ((e.ctrlKey || e.metaKey) && e.key === "1") {
      e.preventDefault();
      onTabChange("write");
    }
    // Ctrl/Cmd + 2 to switch to preview
    if ((e.ctrlKey || e.metaKey) && e.key === "2") {
      e.preventDefault();
      onTabChange("preview");
    }
  };

  const renderPreviewContent = () => {
    if (!content) {
      return <div className="text-gray-500 italic">Start writing markdown to see the preview...</div>;
    }

    return (
      <div className="prose prose-invert max-w-none">
        {/* Cover Image */}
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg mb-8 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🐹</div>
              <h1 className="text-4xl font-bold">Golang Closure</h1>
            </div>
          </div>
        </div>

        {/* Article Title */}
        <h1 className="text-4xl font-bold mb-6">{articleTitle}</h1>

        {/* Content */}
        <div className="text-lg leading-relaxed">{isMarkdownReady ? <MarkdownRenderer content={content} className="text-gray-300" /> : <div className="text-gray-500 italic">Loading preview...</div>}</div>
      </div>
    );
  };

  return (
    <>
      {/* Article Title */}
      <div className="p-6 border-b border-gray-700">
        <input type="text" placeholder="Article Title..." value={articleTitle} onChange={(e) => onTitleChange(e.target.value)} className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-500" />
      </div>

      {/* Editor Mode Toggle */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex bg-gray-800 rounded-lg p-1 w-fit">
          <button onClick={() => onTabChange("write")} className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === "write" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}>
            <Pencil className="w-4 h-4" />
            <span className="text-sm font-medium">Write</span>
          </button>
          <button onClick={() => onTabChange("preview")} className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === "preview" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}>
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Preview</span>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <span>Shortcuts: </span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl+1</kbd>
          <span className="mx-1">Write, </span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl+2</kbd>
          <span className="mx-1">Preview</span>
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6 overflow-y-auto" onKeyDown={handleKeyDown}>
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            placeholder="Start writing markdown..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-500 text-lg leading-relaxed font-mono"
            spellCheck="false"
            autoComplete="off"
          />
        ) : (
          <div className="w-full h-full bg-transparent text-gray-300 text-lg leading-relaxed">{renderPreviewContent()}</div>
        )}
      </div>
    </>
  );
}
