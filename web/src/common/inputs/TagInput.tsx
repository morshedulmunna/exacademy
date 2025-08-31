"use client";

import React from "react";
import { Tag as TagIcon, X } from "lucide-react";

/**
 * TagInput
 * Controlled list of tags with input and remove capability.
 */
export type TagInputProps = {
  label: string;
  tags: string[];
  onChange: (next: string[]) => void;
  inputPlaceholder?: string;
};

export default function TagInput({ label, tags, onChange, inputPlaceholder = "Add a tag and press Enter" }: TagInputProps) {
  const [value, setValue] = React.useState("");

  function addTag() {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) onChange([...tags, trimmed]);
    setValue("");
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <div className="relative flex-1">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder={inputPlaceholder}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 text-xs">
              #{t}
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="ml-1 text-blue-500 hover:text-blue-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
