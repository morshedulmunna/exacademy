"use client";

import React, { useState } from "react";
import BlockEditor from "@/components/ui/BlockEditor";
import { BlogEditorHeader } from "@/app/(administrator)/_@components";
import type { ImageUploadResult } from "@/lib/image-upload";
import { useRouter } from "next/navigation";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [coverImage, setCoverImage] = useState<ImageUploadResult | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsPublishing(true);
    setError(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content, // TipTap provides HTML; renderer handles HTML or Markdown
          coverImage: coverImage?.webp || coverImage?.original,
          published: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to publish post");
      }

      const post = await response.json();
      router.push(`/blog/${post.slug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish post";
      setError(message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top editor header with Add Cover, Add Subtitle, Publish */}
      <BlogEditorHeader
        coverImage={coverImage}
        onAddCover={(img) => setCoverImage(img)}
        onRemoveCover={() => setCoverImage(null)}
        onAddSubtitle={() => {
          /* subtitle support can be added later */
        }}
        onPublish={handlePublish}
        publishDisabled={!title.trim() || !content.trim() || isPublishing}
      />

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Article title */}
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title..." className="w-full bg-transparent text-4xl font-bold border-none outline-none placeholder-gray-500" />

        {/* Rich block editor */}
        <BlockEditor initialContent={content} onChange={setContent} placeholder="Type '/' for commands" />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
