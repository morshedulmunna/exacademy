"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
const BlockEditor = dynamic(() => import("@/components/ui/BlockEditor"), { ssr: false });
import { useRouter } from "next/navigation";
import ImageUpload from "@/common/inputs/ImageUpload";
import BlogEditorHeader from "../../_@components/BlogEditorHeader";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [coverImage, setCoverImage] = useState<any | null>(null);
  const [showCoverUploader, setShowCoverUploader] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsPublishing(true);
    setError(null);

    try {
      const body = {
        title,
        content,
        coverImage,
        isPublishing,
      };
      console.log(body, "Body___");
      // router.push(`/blog/${post.slug}`);
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
        onAddCover={() => setShowCoverUploader(true)}
        onRemoveCover={() => setCoverImage(null)}
        onAddSubtitle={() => {
          /* subtitle support can be added later */
        }}
        onPublish={handlePublish}
        publishDisabled={!title.trim() || !content.trim() || isPublishing}
      />

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {showCoverUploader && (
          <div className="mb-4">
            <ImageUpload
              category="blog"
              onImageUploaded={(img) => {
                setCoverImage(img);
                setShowCoverUploader(false);
              }}
              onImageRemoved={() => setCoverImage(null)}
            />
          </div>
        )}
        {/* Article title */}
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title..." className="w-full bg-transparent text-4xl font-bold border-none outline-none placeholder-gray-500" />

        {/* Rich block editor */}
        <BlockEditor initialContent={content} onChange={setContent} placeholder="Type '/' for commands" />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
