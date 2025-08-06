import React from "react";

/**
 * Dashboard Header Component
 * Displays the header section of the admin dashboard
 */
export default function DashboardHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Manage your blog and courses from here.
      </p>
    </div>
  );
} 