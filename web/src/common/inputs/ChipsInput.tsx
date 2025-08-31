"use client";

import React from "react";
import { Hash, X } from "lucide-react";

/**
 * ChipsInput
 * Generic chips input for string arrays (e.g., learning outcomes).
 */
export type ChipsInputProps = {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  inputPlaceholder?: string;
};

export default function ChipsInput({ label, values, onChange, inputPlaceholder = "Add item and press Enter" }: ChipsInputProps) {
  const [value, setValue] = React.useState("");

  function addValue() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange([...(values || []), trimmed]);
    setValue("");
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue();
              }
            }}
            placeholder={inputPlaceholder}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {values && values.length > 0 && (
        <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {values.map((o, i) => (
            <li key={`${o}-${i}`} className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-md px-3 py-2 flex items-start justify-between gap-2">
              <span className="truncate">{o}</span>
              <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} aria-label={`Remove ${o}`} className="text-gray-500 hover:text-gray-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
