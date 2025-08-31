"use client";

import React from "react";

/**
 * SlugInput
 * Specialized input for slug editing with preview and formatting hooks.
 */
export type SlugInputProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlurFinalize?: (value: string) => string;
  preview?: string;
  error?: string;
};

export default function SlugInput({ name, label, value, onChange, onBlurFinalize, preview, error }: SlugInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (!onBlurFinalize) return;
          const next = onBlurFinalize(value);
          if (next !== value) onChange(next);
        }}
        placeholder="auto-from-title if empty"
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      {preview !== undefined && <p className="mt-1 text-[11px] text-gray-500">Preview: {preview || "(empty)"}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
