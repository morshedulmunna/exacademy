"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    username: string;
    avatar?: string | null;
  };
  replies?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      username: string;
      avatar?: string | null;
    };
  }>;
}

/**
 * Comments renders the comment list and an input box to submit a new comment.
 */
export default function Comments({ slug }: { slug: string }) {
  const { status } = useSession();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${slug}/comments`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setComments(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    if (status !== "authenticated") {
      const callbackUrl = typeof window !== "undefined" ? window.location.pathname : `/blog/${slug}`;
      await signIn(undefined, { callbackUrl });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, parentId: replyParentId }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          const callbackUrl = typeof window !== "undefined" ? window.location.pathname : `/blog/${slug}`;
          await signIn(undefined, { callbackUrl });
        }
        return;
      }
      const created = (await res.json()) as CommentItem;
      if (replyParentId) {
        setComments((prev) => prev.map((c) => (c.id === replyParentId ? { ...c, replies: [{ id: created.id, content: created.content, createdAt: created.createdAt, author: created.author }, ...(c.replies || [])] } : c)));
      } else {
        setComments((prev) => [created, ...prev]);
      }
      setContent("");
      setReplyParentId(null);
    } finally {
      setSubmitting(false);
    }
  }

  function onClickReply(parent: CommentItem) {
    setReplyParentId(parent.id);
    const mention = `@${parent.author.username}`;
    setContent((prev) => {
      const current = prev.trimStart();
      return current.startsWith(`${mention} `) || current.startsWith(mention) ? prev : `${mention} ${prev}`.trimEnd() + " ";
    });
    // focus textarea
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={status === "authenticated" ? "Write a comment..." : "Sign in to write a comment"}
            className="flex-1 rounded-md border border-gray-300/30 bg-transparent p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300/50"
            rows={3}
            disabled={status !== "authenticated" || submitting}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button type="submit" disabled={status !== "authenticated" || submitting || !content.trim()} className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              {c.author?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.author.avatar} alt={c.author.username} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300" />
              )}
              <div>
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-gray-200">{c.author?.name || c.author?.username}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={c.createdAt}>{new Date(c.createdAt).toLocaleString()}</time>
                </div>
                <p className="text-sm leading-6 whitespace-pre-wrap break-words">{c.content}</p>
                <button type="button" onClick={() => onClickReply(c)} className="mt-1 text-xs text-primary hover:underline" aria-label={`Reply to ${c.author?.username}`}>
                  Reply
                </button>

                {c.replies && c.replies.length > 0 && (
                  <ul className="mt-3 ml-10 space-y-3">
                    {c.replies.map((r) => (
                      <li key={r.id} className="flex gap-3">
                        {r.author?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.author.avatar || ""} alt={r.author.username} className="h-6 w-6 rounded-full" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-300" />
                        )}
                        <div>
                          <div className="text-xs text-gray-400">
                            <span className="font-medium text-gray-200">{r.author?.name || r.author?.username}</span>
                            <span className="mx-2">•</span>
                            <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleString()}</time>
                          </div>
                          <p className="text-sm leading-6 whitespace-pre-wrap break-words">{r.content}</p>
                          <button type="button" onClick={() => onClickReply(c)} className="mt-1 text-xs text-primary hover:underline" aria-label={`Reply to ${c.author?.username}`}>
                            Reply
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
