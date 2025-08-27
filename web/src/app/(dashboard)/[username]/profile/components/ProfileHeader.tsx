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
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-start space-x-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          {user.avatar ? <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" /> : <User className="w-12 h-12 text-white" />}
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalCourses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.completedCourses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalCourses > 0 ? Math.round((user.completedCourses / user.totalCourses) * 100) : 0}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
