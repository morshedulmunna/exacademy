import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  newPostUrl: string;
}

/**
 * Page header component for blog management
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, newPostUrl }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
    <Link href={newPostUrl} className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
      <Plus className="w-4 h-4" />
      <span>New Post</span>
    </Link>
  </div>
);
