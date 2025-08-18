"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

/**
 * CodeBlock component for syntax highlighting with copy functionality
 */
export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium  text-muted-foreground">{title}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      )}
      <div className="relative ">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          showLineNumbers={code.split("\n").length > 5}
        >
          {code}
        </SyntaxHighlighter>
        {!title && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        )}
      </div>
    </div>
  );
}
