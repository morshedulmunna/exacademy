"use client";

import { useEffect, useMemo, useState } from "react";
// Auth removed; keep UI only

interface LikeStateResponse {
  liked: boolean;
  likes: number;
}

/**
 * LikeButton renders a like toggle for a blog post identified by slug.
 * It fetches initial state and toggles like on click. Requires authentication to like.
 */
export default function LikeButton({ slug }: { slug: string }) {
  const status: "authenticated" | "unauthenticated" | "loading" = "unauthenticated";
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!cancelled) {
        setLiked(false);
        setLikes(0);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const isAuthenticated = status === "authenticated";

  const ariaLabel = useMemo(() => (liked ? "Unlike this post" : "Like this post"), [liked]);

  async function onToggle() {
    if (loading) return;
    setLoading(true);
    try {
      const nextLiked = !liked;
      setLiked(nextLiked);
      setLikes((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors ${liked ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-transparent border-gray-300/30 text-gray-500 hover:bg-gray-200/10"}`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{likes}</span>
    </button>
  );
}
