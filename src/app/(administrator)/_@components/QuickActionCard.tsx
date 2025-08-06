import React from "react";
import Link from "next/link";

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
}

/**
 * Quick Action Card Component
 * Displays a clickable action card for admin dashboard
 */
export default function QuickActionCard({ 
  href, 
  title, 
  description, 
  icon, 
  bgColor, 
  hoverColor 
}: QuickActionCardProps) {
  return (
    <Link 
      href={href} 
      className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200 group"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${bgColor} rounded-md flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white group-hover:${hoverColor} transition-colors`}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
} 