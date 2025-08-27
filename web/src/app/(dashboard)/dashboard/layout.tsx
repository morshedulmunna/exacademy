import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Clean Dashboard Layout following Udemy design
 * No navigation bar - just clean content area
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
