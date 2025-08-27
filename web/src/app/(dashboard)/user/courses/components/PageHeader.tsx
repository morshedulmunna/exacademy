import React from "react";
import { Flame, Search, Filter, SortAsc, Info } from "lucide-react";

/**
 * Page header component for My Courses following the "My learning" design
 */
export const PageHeader: React.FC = () => (
  <div className="space-y-6">
    {/* Main Header */}
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My learning</h1>

      {/* Tab Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button className="py-2 px-1 border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 font-medium text-sm">All courses</button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm">My Lists</button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm">Wishlist</button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm">Certifications</button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm">Archived</button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm">Learning tools</button>
        </div>
      </nav>
    </div>

    {/* Filter and Search Section */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
      <div className="flex flex-wrap items-center space-x-4">
        <div className="flex items-center space-x-2">
          <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md flex items-center space-x-1">
            <span>Recently Accessed</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Filter by:</span>
          <select className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Categories</option>
          </select>
          <select className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Progress</option>
          </select>
          <select className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Instructor</option>
          </select>
        </div>

        <button className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm">Reset</button>
      </div>

      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search my courses"
          className="w-full pl-10 pr-12 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-purple-600 text-white rounded">
          <Search className="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
);
