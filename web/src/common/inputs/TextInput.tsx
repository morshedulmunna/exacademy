"use client";

import React from "react";

/**
 * TextInput
 * Reusable text input with label, optional left icon, hint and error.
 * Keeps styling consistent across forms.
 */
export type TextInputProps = {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  step?: string | number;
  min?: string | number;
  leftIcon?: React.ReactNode;
  hint?: string;
  error?: string;
  inputClassName?: string;
};

export default function TextInput(props: TextInputProps) {
  const { name, label, value, onChange, onBlur, placeholder, required, type = "text", step, min, leftIcon, hint, error, inputClassName } = props;

  const hasLeftIcon = Boolean(leftIcon);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <div className="relative">
        {hasLeftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</div>}
        <input
          name={name}
          value={value as any}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
          step={step as any}
          min={min as any}
          required={required}
          placeholder={placeholder}
          className={
            (hasLeftIcon
              ? "mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              : "mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500") + (inputClassName ? ` ${inputClassName}` : "")
          }
        />
      </div>
      {hint && !error && <p className="mt-1 text-[11px] text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
