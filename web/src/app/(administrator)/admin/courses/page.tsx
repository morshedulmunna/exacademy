import React from "react";
import Link from "next/link";
import { Plus, BookOpen, DollarSign, Users, Search, Filter, Calendar, Clock, Star, EyeOff, Eye as EyeIcon, Edit, Trash2, MoreHorizontal } from "lucide-react";

/**
 * Course Management Page
 * Clean, static admin interface for managing courses
 */
export default function CourseManagementPage() {
  // Static sample data
  const courses = [
    {
      id: "c1",
      title: "Complete Web Development Bootcamp",
      slug: "web-development-bootcamp",
      excerpt: "Learn web development from scratch with HTML, CSS, JavaScript, and modern frameworks",
      instructor: { name: "Sarah Wilson", email: "sarah@example.com" },
      published: true,
      price: 99.99,
      students: 45,
      rating: 4.8,
      totalLessons: 24,
      totalDuration: 18,
      category: "Web Development",
      createdAt: "2024-01-10",
      image: "/api/placeholder/300/200"
    },
    {
      id: "c2",
      title: "React Masterclass",
      slug: "react-masterclass",
      excerpt: "Master React with hooks, context, and advanced patterns for production apps",
      instructor: { name: "David Lee", email: "david@example.com" },
      published: true,
      price: 79.99,
      students: 32,
      rating: 4.9,
      totalLessons: 18,
      totalDuration: 12,
      category: "Frontend",
      createdAt: "2024-01-08",
      image: "/api/placeholder/300/200"
    },
    {
      id: "c3",
      title: "Advanced JavaScript",
      slug: "advanced-javascript",
      excerpt: "Deep dive into JavaScript ES6+, async programming, and design patterns",
      instructor: { name: "Lisa Chen", email: "lisa@example.com" },
      published: false,
      price: 69.99,
      students: 0,
      rating: 0,
      totalLessons: 15,
      totalDuration: 10,
      category: "JavaScript",
      createdAt: "2024-01-05",
      image: "/api/placeholder/300/200"
    },
    {
      id: "c4",
      title: "Node.js Backend Development",
      slug: "nodejs-backend-development",
      excerpt: "Build scalable backend services with Node.js, Express, and MongoDB",
      instructor: { name: "Mike Johnson", email: "mike@example.com" },
      published: true,
      price: 89.99,
      students: 28,
      rating: 4.7,
      totalLessons: 20,
      totalDuration: 15,
      category: "Backend",
      createdAt: "2024-01-03",
      image: "/api/placeholder/300/200"
    },
    {
      id: "c5",
      title: "UI/UX Design Fundamentals",
      slug: "ui-ux-design-fundamentals",
      excerpt: "Learn the principles of user interface and user experience design",
      instructor: { name: "Alex Brown", email: "alex@example.com" },
      published: true,
      price: 59.99,
      students: 38,
      rating: 4.6,
      totalLessons: 16,
      totalDuration: 8,
      category: "Design",
      createdAt: "2024-01-01",
      image: "/api/placeholder/300/200"
    }
  ];

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.published).length,
    draftCourses: courses.filter(c => !c.published).length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: courses.reduce((sum, c) => sum + (c.price * c.students), 0),
    averageRating: courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / courses.filter(c => c.rating > 0).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your courses, track enrollments, and monitor performance</p>
        </div>
        <Link href="/admin/courses/new" className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <EyeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publishedCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <EyeOff className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draftCourses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="web-development">Web Development</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="javascript">JavaScript</option>
              <option value="design">Design</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            {/* Course Image */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  course.published 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}>
                  {course.published ? "Published" : "Draft"}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{course.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {course.excerpt}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.totalLessons}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.totalDuration}h</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${course.price}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="font-medium">{course.instructor.name}</div>
                  <div>{course.category}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link href={`/courses/${course.slug}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View">
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  <Link href={`/admin/courses/${course.slug}/edit`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Edit">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="More">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
