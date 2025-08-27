import React from "react";
import { Settings } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { FormField } from "./FormField";

/**
 * General settings section component
 */
export const GeneralSettings: React.FC = () => (
  <SettingsSection
    icon={<Settings className="w-6 h-6" />}
    title="General Settings"
    iconBgColor="bg-blue-100 dark:bg-blue-900/20"
    iconColor="text-blue-600 dark:text-blue-400"
  >
    <FormField
      label="Site Name"
      type="text"
      defaultValue="Execute Academy"
    />
    
    <FormField
      label="Site Description"
      type="textarea"
      defaultValue="Premium online learning platform for developers and designers"
    />
    
    <FormField
      label="Contact Email"
      type="email"
      defaultValue="admin@executeacademy.com"
    />
    
    <FormField
      label="Timezone"
      type="select"
      options={[
        { value: "UTC", label: "UTC" },
        { value: "EST", label: "Eastern Time" },
        { value: "PST", label: "Pacific Time" },
        { value: "GMT", label: "Greenwich Mean Time" }
      ]}
    />
  </SettingsSection>
);

