import React from "react";

interface SettingsSectionProps {
  icon: React.ReactNode;
  title: string;
  iconBgColor: string;
  iconColor: string;
  children: React.ReactNode;
}

/**
 * Individual settings section component
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  icon, 
  title, 
  iconBgColor, 
  iconColor, 
  children 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className={`p-2 ${iconBgColor} rounded-lg`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

