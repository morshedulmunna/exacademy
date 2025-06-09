import React from "react";
import CourseFilters from "@/components/course/CourseFilters";
import CourseGrid from "@/components/course/CourseGrid";
import Header from "@/components/Navbar/Header";
import Footer from "@/components/Footer";

type Props = {};

export default function CoursePage({}: Props) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <div className="container mt-12 mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Explore My Courses</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover a wide range of courses designed to help you master new skills and advance your career.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64">
            <CourseFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <CourseGrid />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
