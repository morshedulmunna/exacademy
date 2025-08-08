"use client";

import React, { useState } from "react";
import BlockEditor from "@/components/ui/BlockEditor";
import { BlogEditorHeader } from "@/app/(administrator)/_@components";
import type { ImageUploadResult } from "@/lib/image-upload";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [coverImage, setCoverImage] = useState<ImageUploadResult | null>(null);

  console.log(title, "title_______");
  console.log(content, "content_______");
  console.log(coverImage, "coverImage_______");

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
        onPublish={() => {
          /* hook up publish later */
        }}
        publishDisabled={!title.trim()}
      />

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Article title */}
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title..." className="w-full bg-transparent text-4xl font-bold border-none outline-none placeholder-gray-500" />

        {/* Rich block editor */}
        <BlockEditor initialContent={content} onChange={setContent} placeholder="Type '/' for commands" />
      </div>
    </div>
  );
}
