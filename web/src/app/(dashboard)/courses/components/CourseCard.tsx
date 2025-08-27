import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Star, Play, Share, Plus, Heart, Folder, X } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    rating?: number;
    hasRating: boolean;
  };
}

/**
 * Course card component following the "My learning" design
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderThumbnail = (title: string) => {
    // Generate different thumbnail styles based on course title
    if (title.toLowerCase().includes("rust")) {
      return (
        <div className="w-full h-32 bg-gray-900 dark:bg-gray-800 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 opacity-20"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">R</div>
            <div className="text-lg font-semibold text-blue-300">RUST</div>
          </div>

          {/* Play button overlay on hover */}
          <div className={`absolute inset-0 bg-black z-30 transition-all duration-300 ease-in-out ${isHovered ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"} flex items-center justify-center`}>
            <div className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? "scale-100" : "scale-75"}`}>
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("kubernetes")) {
      return (
        <div className="w-full h-32 bg-blue-100 dark:bg-blue-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900"></div>
          <div className="relative z-10 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
          </div>

          {/* Play button overlay on hover */}
          <div className={`absolute inset-0 bg-black z-30 transition-all duration-300 ease-in-out ${isHovered ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"} flex items-center justify-center`}>
            <div className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? "scale-100" : "scale-75"}`}>
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("devops")) {
      return (
        <div className="w-full h-32 bg-gray-800 dark:bg-gray-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 opacity-20"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl text-blue-400 mb-2">∞</div>
            <div className="text-sm text-gray-300 dark:text-gray-200">DevOps</div>
          </div>

          {/* Play button overlay on hover */}
          <div className={`absolute inset-0 bg-black z-30 transition-all duration-300 ease-in-out ${isHovered ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"} flex items-center justify-center`}>
            <div className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? "scale-100" : "scale-75"}`}>
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("go") || title.toLowerCase().includes("golang")) {
      return (
        <div className="w-full h-32 bg-blue-100 dark:bg-blue-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl text-blue-600 dark:text-blue-300 mb-2">{`{}`}</div>
            <div className="text-sm text-blue-700 dark:text-blue-200">Go</div>
          </div>

          {/* Play button overlay on hover */}
          <div className={`absolute inset-0 bg-black z-30 transition-all duration-300 ease-in-out ${isHovered ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"} flex items-center justify-center`}>
            <div className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? "scale-100" : "scale-75"}`}>
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <div className="text-2xl text-white mb-1">📚</div>
            <div className="text-sm text-white">Course</div>
          </div>

          {/* Play button overlay on hover */}
          <div className={`absolute inset-0 bg-black z-30 transition-all duration-300 ease-in-out ${isHovered ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"} flex items-center justify-center`}>
            <div className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? "scale-100" : "scale-75"}`}>
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      );
    }
  };

  const renderRating = () => {
    if (course.hasRating && course.rating) {
      return (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < course.rating! ? "text-yellow-400 fill-current" : "text-gray-400 dark:text-gray-500"}`} />
          ))}
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">Your rating</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          ))}
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">Leave a rating</span>
        </div>
      );
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 ease-in-out relative shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Three-dot menu */}
      <div className="absolute top-2 right-2 z-20">
        <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setShowDropdown(!showDropdown)}>
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div ref={dropdownRef} className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-30">
            {/* Lists Section */}
            <div className="px-3 py-2">
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Lists</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">You have no list</div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            {/* Menu Items */}
            <button className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm">
              <Plus className="w-4 h-4" />
              <span>Create New List</span>
            </button>

            <button className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm">
              <Heart className="w-4 h-4" />
              <span>Favorite</span>
            </button>

            <button className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm">
              <Folder className="w-4 h-4" />
              <span>Archive</span>
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail */}
      {renderThumbnail(course.title)}

      {/* Course Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">{course.instructor}</p>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">{course.progress}% complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div className="h-1 bg-purple-500 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>

        {/* Rating */}
        {renderRating()}
      </div>
    </div>
  );
};
