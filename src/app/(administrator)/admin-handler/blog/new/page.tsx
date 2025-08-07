"use client";

import React, { useState } from "react";
import { BlogSidebar, BlogEditorHeader, BlogEditorContent } from "../../../_@components";
import { ImageUploadResult } from "@/lib/image-upload";

export default function NewBlogPage() {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [articleTitle, setArticleTitle] = useState("🧠 How Closures Work Under the Hood in Go.");
  const [content, setContent] = useState(`# Go Closures এর ভিতরের কাজ – Struct, Heap Allocation & Memory Management

Go তে closure মানেই শুধু একটা anonymous function নয় — এর সাথে থাকে একটা hidden struct, যা captured variables গুলো store করে। এই struct টা heap এ allocate হয়, কারণ function এর scope এর বাইরে থাকা variables গুলো access করতে হয়।

## What is a Closure?

A closure is a function that captures variables from its surrounding scope. In Go, closures are implemented using a hidden struct that stores the captured variables.

## How Closures Work in Go

When you create a closure in Go, the compiler creates a hidden struct that contains all the captured variables. This struct is allocated on the heap because the variables need to outlive the function's scope.

### Example:

\`\`\`go
func createCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}
\`\`\`

In this example, the \`count\` variable is captured by the closure and stored in a hidden struct.`);
  const [darkMode, setDarkMode] = useState(true);
  const [rawMarkdownEditor, setRawMarkdownEditor] = useState(false);
  const [coverImage, setCoverImage] = useState<ImageUploadResult | null>(null);

  // Event handlers
  const handleDraftSelect = (draftId: string) => {
    console.log("Selected draft:", draftId);
    // TODO: Load draft content
  };

  const handleNewDraft = () => {
    console.log("Creating new draft");
    // TODO: Create new draft
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  const handleAddCover = (imageResult: ImageUploadResult) => {
    console.log("Cover image uploaded:", imageResult);
    setCoverImage(imageResult);
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
  };

  const handleAddSubtitle = () => {
    console.log("Adding subtitle");
    // TODO: Implement subtitle functionality
  };

  const handlePublish = () => {
    console.log("Publishing article:", { title: articleTitle, content });
    // TODO: Implement publish functionality
  };

  const handleCopyMarkdown = () => {
    const markdownContent = `# ${articleTitle}\n\n${content}`;
    navigator.clipboard.writeText(markdownContent);
    console.log("Markdown copied to clipboard");
  };

  const handleToggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    console.log("Dark mode:", enabled);
  };

  const handleToggleRawEditor = (enabled: boolean) => {
    setRawMarkdownEditor(enabled);
    console.log("Raw markdown editor:", enabled);
  };

  const handleTabChange = (tab: "write" | "preview") => {
    setActiveTab(tab);
  };

  const handleTitleChange = (title: string) => {
    setArticleTitle(title);
  };

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <BlogSidebar onDraftSelect={handleDraftSelect} onNewDraft={handleNewDraft} onSearch={handleSearch} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Controls */}
        <BlogEditorHeader
          onAddCover={handleAddCover}
          onRemoveCover={handleRemoveCover}
          coverImage={coverImage}
          onAddSubtitle={handleAddSubtitle}
          onPublish={handlePublish}
          onCopyMarkdown={handleCopyMarkdown}
          onToggleDarkMode={handleToggleDarkMode}
          onToggleRawEditor={handleToggleRawEditor}
          darkMode={darkMode}
          rawMarkdownEditor={rawMarkdownEditor}
        />

        {/* Content Editor */}
        <BlogEditorContent activeTab={activeTab} articleTitle={articleTitle} content={content} onTabChange={handleTabChange} onTitleChange={handleTitleChange} onContentChange={handleContentChange} />
      </div>
    </div>
  );
}
