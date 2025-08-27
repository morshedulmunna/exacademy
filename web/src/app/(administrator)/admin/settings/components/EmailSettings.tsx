import React from "react";
import { Mail } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { FormField } from "./FormField";

/**
 * Email configuration settings section component
 */
export const EmailSettings: React.FC = () => (
  <SettingsSection
    icon={<Mail className="w-6 h-6" />}
    title="Email Configuration"
    iconBgColor="bg-purple-100 dark:bg-purple-900/20"
    iconColor="text-purple-600 dark:text-purple-400"
  >
    <FormField
      label="SMTP Host"
      type="text"
      defaultValue="smtp.gmail.com"
    />
    
    <FormField
      label="SMTP Port"
      type="number"
      defaultValue={587}
    />
    
    <FormField
      label="From Email"
      type="email"
      defaultValue="noreply@executeacademy.com"
    />
    
    <FormField
      label="From Name"
      type="text"
      defaultValue="Execute Academy"
    />
  </SettingsSection>
);

