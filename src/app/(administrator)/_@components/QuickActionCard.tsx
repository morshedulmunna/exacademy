import React from "react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Quick Action Card Component
 * Displays a clickable action card for quick navigation
 */
export default function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color, 
  bgColor, 
  borderColor 
}: QuickActionCardProps) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400", 
    purple: "text-purple-600 dark:text-purple-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    gray: "text-gray-600 dark:text-gray-400"
  };

  const iconColorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500", 
    yellow: "bg-yellow-500",
    indigo: "bg-indigo-500",
    gray: "bg-gray-500"
  };

  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl border ${bgColor} ${borderColor} transition-all duration-200 hover:shadow-lg hover:scale-105 group`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${iconColorClasses[color as keyof typeof iconColorClasses]} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${colorClasses[color as keyof typeof colorClasses]} mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
} 