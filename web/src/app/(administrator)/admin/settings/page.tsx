"use client";

import React from "react";
import { PageHeader, GeneralSettings, UserManagementSettings, SecuritySettings, EmailSettings, PaymentSettings, NotificationSettings, SaveButton } from "./components";

/**
 * Settings Page
 * Clean, component-based admin interface for managing system settings
 */
export default function SettingsPage() {
  const handleSave = () => {};

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage system configuration and preferences" onSave={handleSave} />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeneralSettings />
        <UserManagementSettings />
        <SecuritySettings />
        <EmailSettings />
        <PaymentSettings />
        <NotificationSettings />
      </div>

      <SaveButton onSave={handleSave} />
    </div>
  );
}
