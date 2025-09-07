import { useThemeGradients } from "@/components/ui/ThemeGradients";
import React from "react";

type Props = {
  isCollapsed: boolean;
};

export default function Logo({ isCollapsed }: Props) {
  const gradients = useThemeGradients();

  return (
    <div className="flex items-center space-x-2">
      {/* Logo Image */}

      {/* Logo Text - only show when not collapsed */}
      {!isCollapsed && (
        <>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">EA</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${gradients.textGradient}`}>ExAcademy</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</span>
          </div>
        </>
      )}
    </div>
  );
}
