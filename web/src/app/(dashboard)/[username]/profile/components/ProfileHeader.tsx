import React from "react";
import { User, Camera, Edit } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    joinDate: string;
    totalCourses: number;
    completedCourses: number;
  };
}

/**
 * Profile header component for learner profile page
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
      {/* Avatar Section */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
          {user.avatar ? <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" /> : <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
          <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* User Info Section */}
      <div className="flex-1 text-center lg:text-left">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-1">{user.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Member since{" "}
            {new Date(user.joinDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.totalCourses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.completedCourses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.totalCourses > 0 ? Math.round((user.completedCourses / user.totalCourses) * 100) : 0}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="lg:self-start">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-medium">
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  </div>
);
