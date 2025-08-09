"use client";

import React, { useEffect, useRef, useState } from "react";
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
  // Active inline reply editor and its content
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const replyTextareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  /**
   * Formats a timestamp into a short relative string like "2h ago".
   */
  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const diffMs = date.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const divisions: Array<[Intl.RelativeTimeFormatUnit, number]> = [
      ["year", 1000 * 60 * 60 * 24 * 365],
      ["month", 1000 * 60 * 60 * 24 * 30],
      ["week", 1000 * 60 * 60 * 24 * 7],
      ["day", 1000 * 60 * 60 * 24],
      ["hour", 1000 * 60 * 60],
      ["minute", 1000 * 60],
      ["second", 1000],
    ];
    for (const [unit, ms] of divisions) {
      const amount = Math.round(diffMs / ms);
      if (Math.abs(amount) >= 1) return rtf.format(amount, unit);
    }
    return "just now";
  }

  /**
   * Highlights mentions (e.g., @username) in a block of text.
   */
  function renderWithMentions(text: string): React.ReactNode[] {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) =>
      /^@[a-zA-Z0-9_]+$/.test(part) ? (
        <span key={idx} className="text-primary font-medium">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  }

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
        body: JSON.stringify({ content: trimmed, parentId: null }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          const callbackUrl = typeof window !== "undefined" ? window.location.pathname : `/blog/${slug}`;
          await signIn(undefined, { callbackUrl });
        }
        return;
      }
      const created = (await res.json()) as CommentItem;
      setComments((prev) => [created, ...prev]);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyParentId || submitting) return;
    const trimmed = replyContent.trim();
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
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyParentId
            ? {
                ...c,
                replies: [{ id: created.id, content: created.content, createdAt: created.createdAt, author: created.author }, ...(c.replies || [])],
              }
            : c
        )
      );
      setReplyContent("");
      setReplyParentId(null);
    } finally {
      setSubmitting(false);
    }
  }

  function onClickReply(parent: CommentItem) {
    setReplyParentId(parent.id);
    const mention = `@${parent.author.username}`;
    setReplyContent((prev) => {
      const current = prev.trimStart();
      return current.startsWith(`${mention} `) || current.startsWith(mention) ? prev : `${mention} ${prev}`.trimEnd() + " ";
    });
    // focus inline textarea for this comment
    requestAnimationFrame(() => replyTextareaRefs.current[parent.id]?.focus());
  }

  // inline reply editor is rendered directly beneath the comment; no separate banner needed

  return (
    <section className="mt-12 rounded-xl border border-gray-800/50 bg-black/20 p-4 sm:p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold">Comments</h3>
        {comments.length > 0 && (
          <span className="text-xs sm:text-sm text-gray-400">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600" />
          <div className="flex-1 rounded-lg border border-gray-800 bg-black/30 focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onSubmit(e as unknown as React.FormEvent);
              }}
              placeholder={status === "authenticated" ? "Share your thoughts. Use @ to mention someone…" : "Sign in to write a comment"}
              className="w-full resize-y rounded-lg bg-transparent p-3 text-sm outline-none placeholder:text-gray-500"
              rows={3}
              disabled={status !== "authenticated" || submitting}
            />
            <div className="flex items-center justify-between border-t border-gray-800 px-3 py-2">
              <p className="text-[11px] text-gray-500">Press ⌘/Ctrl + Enter to post</p>
              <div className="flex items-center gap-2">
                {status !== "authenticated" && (
                  <button type="button" onClick={() => signIn(undefined, { callbackUrl: typeof window !== "undefined" ? window.location.pathname : `/blog/${slug}` })} className="rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-800/60">
                    Sign in
                  </button>
                )}
                <button type="submit" disabled={status !== "authenticated" || submitting || !content.trim()} className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">
                  {submitting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <ul className="space-y-4">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded bg-gray-800 animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-gray-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-800 animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">Be the first to start the discussion.</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="group flex gap-3 rounded-lg border border-gray-800/80 bg-black/10 p-3 sm:p-4">
              {c.author?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.author.avatar} alt={c.author.username} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-700" />
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-x-2 text-xs text-gray-400">
                  <span className="font-medium text-gray-200">{c.author?.name || c.author?.username}</span>
                  <span>•</span>
                  <time title={new Date(c.createdAt).toLocaleString()} dateTime={c.createdAt}>
                    {formatRelativeTime(c.createdAt)}
                  </time>
                </div>
                <div className="text-sm leading-6 whitespace-pre-wrap break-words">{renderWithMentions(c.content)}</div>
                <button type="button" onClick={() => onClickReply(c)} className="mt-2 inline-flex items-center rounded px-2 py-1 text-xs text-primary hover:bg-primary/10" aria-label={`Reply to ${c.author?.username}`}>
                  Reply
                </button>

                {c.replies && c.replies.length > 0 && (
                  <ul className="mt-3 space-y-3 border-l border-gray-800 pl-4 sm:pl-6">
                    {c.replies.map((r) => (
                      <li key={r.id} className="flex gap-3">
                        {r.author?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.author.avatar || ""} alt={r.author.username} className="h-6 w-6 rounded-full" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-700" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-x-2 text-[11px] text-gray-400">
                            <span className="font-medium text-gray-200">{r.author?.name || r.author?.username}</span>
                            <span>•</span>
                            <time title={new Date(r.createdAt).toLocaleString()} dateTime={r.createdAt}>
                              {formatRelativeTime(r.createdAt)}
                            </time>
                          </div>
                          <div className="text-sm leading-6 whitespace-pre-wrap break-words">{renderWithMentions(r.content)}</div>
                          <div className="mt-2">
                            <button type="button" onClick={() => onClickReply(c)} className="inline-flex items-center rounded px-2 py-1 text-xs text-primary hover:bg-primary/10" aria-label={`Reply to ${c.author?.username}`}>
                              Reply
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {replyParentId === c.id && (
                  <form onSubmit={onSubmitReply} className="mt-3 flex items-start gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600" />
                    <div className="flex-1 rounded-lg border border-gray-800 bg-black/30 focus-within:ring-2 focus-within:ring-primary/20">
                      <textarea
                        ref={(el) => {
                          replyTextareaRefs.current[c.id] = el;
                        }}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onSubmitReply(e as unknown as React.FormEvent);
                        }}
                        placeholder={`Reply to @${c.author.username}`}
                        className="w-full resize-y rounded-lg bg-transparent p-2 text-sm outline-none placeholder:text-gray-500"
                        rows={2}
                        disabled={status !== "authenticated" || submitting}
                      />
                      <div className="flex items-center justify-between border-t border-gray-800 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyParentId(null);
                            setReplyContent("");
                          }}
                          className="rounded-md border border-gray-700 px-2 py-1 text-[11px] text-gray-300 hover:bg-gray-800/60"
                        >
                          Cancel
                        </button>
                        <button type="submit" disabled={status !== "authenticated" || submitting || !replyContent.trim()} className="rounded-md bg-primary px-3 py-1.5 text-xs text-white disabled:opacity-50">
                          {submitting ? "Posting…" : "Reply"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
