"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

/**
 * Small button to copy the current section anchor link to clipboard.
 */
export default function CopyAnchor({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600"
      aria-label="Copy section link"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

