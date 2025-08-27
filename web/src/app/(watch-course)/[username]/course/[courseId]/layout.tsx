import React from "react";
import { BookOpen, Clock, Star, User, Share, MoreVertical, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DetailsHeader from "./components/DetailsHeader";

interface CourseLayoutProps {
  children: React.ReactNode;
}

/**
 * Course Detail Layout - Separate from main dashboard layout
 * Matches Udemy course page design with top navigation
 */
export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 rounded-md dark:bg-gray-900">
      {/* Top Navigation Bar - Udemy Style */}
      <DetailsHeader />

      {/* Main Content Area */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
