"use client";

import React from "react";

/**
 * Checkbox
 * Simple checkbox with label rendered on the right.
 */
export type CheckboxProps = {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({ id, name, label, checked, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <input id={id} name={name} checked={checked} onChange={onChange} type="checkbox" className="h-4 w-4" />
    </div>
  );
}
