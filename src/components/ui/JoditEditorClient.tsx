"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "jodit/es2021/jodit.min.css";
import { useTheme } from "@/themes/ThemeProvider";

// Dynamically import to avoid any SSR quirks in certain environments
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export interface JoditEditorClientProps {
  /** HTML content */
  value?: string;
  /** Called with HTML string when content changes */
  onChange?: (html: string) => void;
  /** Placeholder to display when empty */
  placeholder?: string;
  /** Optional className for outer wrapper */
  className?: string;
  /** Editor height in pixels (minHeight). Defaults to 320 */
  heightPx?: number;
}

/**
 * A lightweight, client-only wrapper around Jodit WYSIWYG editor.
 * Exposes a controlled API via value/onChange to integrate with forms.
 */
export default function JoditEditorClient({ value = "", onChange, placeholder = "Start writing...", className = "", heightPx = 320 }: JoditEditorClientProps) {
  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      readonly: false,
      minHeight: heightPx,
      height: heightPx,
      placeholder,
      // Apply editor theme based on app theme
      // Jodit supports 'default' and 'dark'
      theme: theme === "dark" ? "dark" : "default",
      // Keep toolbar concise but useful; can be extended later as needed
      buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "link", "image", "table", "|", "left", "center", "right", "|", "undo", "redo", "|", "hr", "eraser", "fullsize"],
      toolbarAdaptive: true,
      showXPathInStatusbar: false,
      statusbar: true,
      uploader: { insertImageAsBase64URI: true },
      cleanHTML: {
        removeEmptyElements: true,
      },
    }),
    [heightPx, placeholder, theme]
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Key forces remount so Jodit re-applies theme on toggle */}
      <JoditEditor key={theme} value={value} config={config} onChange={(content: string) => onChange?.(content)} />
    </div>
  );
}
