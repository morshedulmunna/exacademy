import React from "react";
import { User, Search, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  userData: any;
}

/**
 * Clean dashboard header component following Udemy design
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userData }) => {
  const { data } = userData;

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              {data?.avatar_url ? <img src={data?.avatar_url} alt={data?.username} className="w-16 h-16 rounded-full object-cover" /> : <User className="w-8 h-8 text-white" />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {data?.full_name || data?.username || "User"}! 👋</h1>
            <p className="text-lg text-gray-300 mt-2">Ready to continue your learning journey?</p>
          </div>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search for courses..." className="w-full pl-12 pr-6 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400" />
        </div>
      </div>
    </div>
  );
};
