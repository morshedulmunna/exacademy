import React from "react";

interface FormFieldProps {
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox";
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  placeholder?: string;
}

/**
 * Form field component for settings forms
 */
export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  type, 
  defaultValue, 
  options, 
  min, 
  max, 
  step, 
  rows = 3,
  placeholder 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    
    {type === "textarea" && (
      <textarea
        rows={rows}
        defaultValue={defaultValue as string}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    )}
    
    {type === "select" && (
      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
    
    {type === "checkbox" && (
      <div className="flex items-center">
        <input
          type="checkbox"
          defaultChecked={defaultValue as boolean}
          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{placeholder}</span>
      </div>
    )}
    
    {["text", "email", "number"].includes(type) && (
      <input
        type={type}
        defaultValue={defaultValue as string | number}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    )}
  </div>
);

