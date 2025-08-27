import React from "react";
import { Flame, Search, Filter, SortAsc, Info } from "lucide-react";

/**
 * Page header component for My Courses following the "My learning" design
 */
export const PageHeader: React.FC = () => (
  <div className="space-y-6">
    {/* Main Header */}
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">My learning</h1>
    </div>

    {/* Weekly Streak Section */}
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Weekly streak</h2>
            <p className="text-gray-400">One ring down, one to go. Keep it up!</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">1 week</p>
              <p className="text-sm text-gray-400">Current streak</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#374151" strokeWidth="2" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3.33, 30" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white font-medium">1/30</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">course min</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">visit</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-white font-medium">Aug 24 - 31</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Filter and Search Section */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
      <div className="flex flex-wrap items-center space-x-4">
        <div className="flex items-center space-x-2">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Sort by:</span>
          <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md flex items-center space-x-1">
            <span>Recently Accessed</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filter by:</span>
          <select className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md border border-gray-600">
            <option>Categories</option>
          </select>
          <select className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md border border-gray-600">
            <option>Progress</option>
          </select>
          <select className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md border border-gray-600">
            <option>Instructor</option>
          </select>
        </div>

        <button className="px-3 py-1 text-gray-400 hover:text-white text-sm">Reset</button>
      </div>

      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" placeholder="Search my courses" className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-purple-600 text-white rounded">
          <Search className="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
);
