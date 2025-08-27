import React from "react";
import { BookOpen, Users, Award } from "lucide-react";

interface ActivityIconProps {
  type: string;
}

/**
 * Activity icon component that displays different icons based on activity type
 */
export const ActivityIcon: React.FC<ActivityIconProps> = ({ type }) => {
  const getIconConfig = (type: string) => {
    switch (type) {
      case "course_enrollment":
        return {
          icon: <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />,
          bgColor: "bg-green-100 dark:bg-green-900/20",
        };
      case "new_user":
        return {
          icon: <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
        };
      default:
        return {
          icon: <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          bgColor: "bg-purple-100 dark:bg-purple-900/20",
        };
    }
  };

  const { icon, bgColor } = getIconConfig(type);

  return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>{icon}</div>;
};
