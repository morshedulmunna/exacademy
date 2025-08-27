import React from "react";
import { Shield } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { FormField } from "./FormField";

/**
 * Security settings section component
 */
export const SecuritySettings: React.FC = () => (
  <SettingsSection
    icon={<Shield className="w-6 h-6" />}
    title="Security"
    iconBgColor="bg-red-100 dark:bg-red-900/20"
    iconColor="text-red-600 dark:text-red-400"
  >
    <FormField
      label="Password Minimum Length"
      type="number"
      defaultValue={8}
      min={6}
      max={20}
    />
    
    <FormField
      label="Require Strong Passwords"
      type="checkbox"
      defaultValue={true}
      placeholder="Require uppercase, lowercase, numbers, and symbols"
    />
    
    <FormField
      label="Two-Factor Authentication"
      type="checkbox"
      defaultValue={false}
      placeholder="Enable 2FA for all users"
    />
    
    <FormField
      label="Rate Limiting (requests per minute)"
      type="number"
      defaultValue={100}
      min={10}
      max={1000}
    />
  </SettingsSection>
);

