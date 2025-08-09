"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import BlockEditor from "@/components/ui/BlockEditor";
import { BlogEditorHeader } from "@/app/(administrator)/_@components";
import type { ImageUploadResult } from "@/lib/image-upload";

/**
 * Blog Edit Page
 * Loads a post by slug and allows updating title/content/coverImage/published.
 */
export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<ImageUploadResult | null>(null);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to load post");
        }
        const post = await res.json();
        setTitle(post.title || "");
        setContent(post.content || "");
        setPublished(Boolean(post.published));
        if (post.coverImage) {
          setCoverImage({
            original: post.coverImage,
            thumbnail: post.coverImage,
            webp: post.coverImage,
            webpThumbnail: post.coverImage,
            filename: post.coverImage.split("/").pop() || "cover.jpg",
            size: 0,
            width: 0,
            height: 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsFetching(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          coverImage: coverImage?.webp || coverImage?.original,
          published,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update post");
      }
      const post = await res.json();
      router.push(`/blog/${post.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin-handler/blog" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin-handler/blog" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
        <button onClick={handleSave} disabled={isSaving || !title.trim() || !content.trim()} className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <BlogEditorHeader coverImage={coverImage} onAddCover={(img) => setCoverImage(img)} onRemoveCover={() => setCoverImage(null)} onPublish={handleSave} publishDisabled={!title.trim() || !content.trim() || isSaving} />

      <div className="px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title..." className="w-full bg-transparent text-4xl font-bold border-none outline-none placeholder-gray-500" />
          <div className="ml-4 text-sm text-gray-500 flex items-center gap-2">
            <span>Status:</span>
            <button onClick={() => setPublished((v) => !v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${published ? "bg-green-600" : "bg-gray-600"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${published ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className={`${published ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>{published ? "Published" : "Draft"}</span>
          </div>
        </div>

        <BlockEditor initialContent={content} onChange={setContent} placeholder="Type '/' for commands" />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
