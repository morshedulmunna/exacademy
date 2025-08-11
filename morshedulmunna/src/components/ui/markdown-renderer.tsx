"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import createDOMPurify from "dompurify";
import { Clipboard, ClipboardCheck } from "lucide-react";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-go";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Small reusable copy-to-clipboard button used on code blocks.
 * Uses the modern Clipboard API with a graceful textarea fallback.
 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (_) {
      // Swallow error to avoid UI noise; copy failures are non-critical
    }
  }

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      aria-label={copied ? "Copied" : "Copy code"}
      className="inline-flex items-center gap-1.5 text-[11px] tracking-wide uppercase font-semibold rounded px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700"
    >
      {copied ? (
        <>
          <span>COPIED</span>
          <ClipboardCheck size={14} />
        </>
      ) : (
        <>
          <span>COPY</span>
          <Clipboard size={14} />
        </>
      )}
    </button>
  );
}

/**
 * A reusable markdown renderer component with syntax highlighting
 * Supports GitHub Flavored Markdown (GFM) and custom styling
 */
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Highlight code blocks after component mounts
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const DOMPurify = typeof window !== "undefined" ? createDOMPurify(window) : null;

  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      {/* If content looks like HTML, render it directly; otherwise, render as Markdown */}
      {/^\s*</.test(content) ? (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify ? DOMPurify.sanitize(content) : content }} />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ node, inline, className, children, ...props }: any) => {
              if (inline) {
                return (
                  <code className="bg-gray-200 overflow-auto dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                );
              }

              const language = (className || "").replace("language-", "").toUpperCase();
              const codeClassName = `${className ?? ""} bg-transparent font-mono text-[15px] leading-7`;

              const raw = String(children).replace(/\n$/, "");

              return (
                <div className="relative my-4 group not-prose">
                  <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                    <CopyButton text={raw} />
                  </div>
                  <pre className="bg-slate-800 text-slate-100 p-5 md:p-6 rounded-2xl overflow-x-auto border border-slate-700">
                    <code className={`${codeClassName} block`} {...props}>
                      {raw}
                    </code>
                  </pre>
                </div>
              );
            },
            img: ({ src, alt, ...props }: any) => <img src={src} alt={alt} className="w-full h-auto rounded-lg my-4" {...props} />,
            a: ({ href, children, ...props }: any) => (
              <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            ),
            blockquote: ({ children, ...props }: any) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4" {...props}>
                {children}
              </blockquote>
            ),
            table: ({ children, ...props }: any) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }: any) => (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }: any) => (
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
