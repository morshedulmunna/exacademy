import React from "react";
import { Save } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onSave: () => void;
}

/**
 * Page header component for settings page
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onSave }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
    <button 
      onClick={onSave}
      className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <Save className="w-4 h-4" />
      <span>Save Changes</span>
    </button>
  </div>
);

