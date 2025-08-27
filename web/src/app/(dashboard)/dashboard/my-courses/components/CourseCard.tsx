import React from "react";
import Link from "next/link";
import { MoreVertical, Star } from "lucide-react";

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
  const renderThumbnail = (title: string) => {
    // Generate different thumbnail styles based on course title
    if (title.toLowerCase().includes("rust")) {
      return (
        <div className="w-full h-32 bg-gray-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 opacity-20"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">R</div>
            <div className="text-lg font-semibold text-blue-300">RUST</div>
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("kubernetes")) {
      return (
        <div className="w-full h-32 bg-blue-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300"></div>
          <div className="relative z-10 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("devops")) {
      return (
        <div className="w-full h-32 bg-gray-800 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 opacity-20"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl text-blue-400 mb-2">∞</div>
            <div className="text-sm text-gray-300">DevOps</div>
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("go") || title.toLowerCase().includes("golang")) {
      return (
        <div className="w-full h-32 bg-blue-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl text-blue-600 mb-2">{`{}`}</div>
            <div className="text-sm text-blue-700">Go</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-white mb-1">📚</div>
            <div className="text-sm text-white">Course</div>
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
            <Star key={i} className={`w-4 h-4 ${i < course.rating! ? "text-yellow-400 fill-current" : "text-gray-400"}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">Your rating</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gray-400" />
          ))}
          <span className="text-xs text-gray-400 ml-1">Leave a rating</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
      {/* Three-dot menu */}
      <div className="absolute top-2 right-2 z-10">
        <button className="p-1 text-gray-400 hover:text-white rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail */}
      {renderThumbnail(course.title)}

      {/* Course Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-400 text-xs mb-3">{course.instructor}</p>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">{course.progress}% complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div className="h-1 bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>

        {/* Rating */}
        {renderRating()}
      </div>
    </div>
  );
};
