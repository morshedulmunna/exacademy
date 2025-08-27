import React from "react";
import { Bell } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { FormField } from "./FormField";

/**
 * Notification settings section component
 */
export const NotificationSettings: React.FC = () => (
  <SettingsSection icon={<Bell className="w-6 h-6" />} title="Notifications" iconBgColor="bg-yellow-100 dark:bg-yellow-900/20" iconColor="text-yellow-600 dark:text-yellow-400">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Notifications</label>
      <div className="space-y-2">
        <FormField label="" type="checkbox" defaultValue={true} placeholder="New user registrations" />
        <FormField label="" type="checkbox" defaultValue={true} placeholder="Course enrollments" />
        <FormField label="" type="checkbox" defaultValue={false} placeholder="Payment confirmations" />
        <FormField label="" type="checkbox" defaultValue={true} placeholder="System alerts" />
      </div>
    </div>
  </SettingsSection>
);
