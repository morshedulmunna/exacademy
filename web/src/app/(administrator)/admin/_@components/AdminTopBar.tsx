"use client";

import React from "react";
import Link from "next/link";
import { useThemeGradients } from "@/components/ui/ThemeGradients";
import { Shield, ArrowLeft, Bell, Search, User } from "lucide-react";
import ThemeToggler from "@/themes/ThemeToggler";

interface AdminTopBarProps {
  userName: string;
}

/**
 * Admin Top Bar Component
 * Displays the admin panel top navigation with search, notifications, and user menu
 */
export default function AdminTopBar({ userName }: AdminTopBarProps) {
  const gradients = useThemeGradients();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and navigation back */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Shield className={`w-6 h-6 ${gradients.iconColor}`} />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
          </div>

          {/* Right side - Search, notifications, user menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent dark:text-white ${gradients.focusRing}`}
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme toggler */}
            <ThemeToggler />

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${gradients.bgGradient}`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gradients.badgeBg} ${gradients.badgeText}`}>ADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
