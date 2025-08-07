import React from "react";
import Link from "next/link";
import { useThemeGradients } from "@/components/ui/ThemeGradients";
import { Shield, ArrowLeft } from "lucide-react";
import ThemeToggler from "@/themes/ThemeToggler";

interface AdminHeaderProps {
  userName: string;
}

/**
 * Admin Header Component
 * Displays the admin panel header with navigation back to dashboard
 */
export default function AdminHeader({ userName }: AdminHeaderProps) {
  const gradients = useThemeGradients();
  
  return (
    <header className="bg-white dark:bg-gray-900/30 shadow-sm border-b border-gray-200 dark:border-gray-900 transition-colors duration-200">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${gradients.iconColor}`} />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Welcome, {userName}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gradients.badgeBg} ${gradients.badgeText}`}>ADMIN</span>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
}
