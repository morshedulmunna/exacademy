import React from "react";
import { User } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { FormField } from "./FormField";

/**
 * User management settings section component
 */
export const UserManagementSettings: React.FC = () => (
  <SettingsSection
    icon={<User className="w-6 h-6" />}
    title="User Management"
    iconBgColor="bg-green-100 dark:bg-green-900/20"
    iconColor="text-green-600 dark:text-green-400"
  >
    <FormField
      label="Default User Role"
      type="select"
      options={[
        { value: "student", label: "Student" },
        { value: "instructor", label: "Instructor" },
        { value: "admin", label: "Admin" }
      ]}
    />
    
    <FormField
      label="Email Verification Required"
      type="checkbox"
      defaultValue={true}
      placeholder="Require email verification for new accounts"
    />
    
    <FormField
      label="Auto-approve Instructors"
      type="checkbox"
      defaultValue={false}
      placeholder="Automatically approve instructor applications"
    />
    
    <FormField
      label="Session Timeout (minutes)"
      type="number"
      defaultValue={30}
      min={5}
      max={120}
    />
  </SettingsSection>
);

