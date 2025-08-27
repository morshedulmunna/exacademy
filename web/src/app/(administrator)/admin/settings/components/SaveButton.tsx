import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
}

/**
 * Save button component for settings page
 */
export const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => (
  <div className="flex justify-end">
    <button onClick={onSave} className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
      <Save className="w-5 h-5" />
      <span>Save All Changes</span>
    </button>
  </div>
);
